var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var uuid = require('node-uuid');
var cfg = require('./appConfig.js').cfg;



String.prototype.replaceRemoteLocalName = function(from, to) {		
	var ret = this.replace(from, to);
	if (from.indexOf(":80") >= 1) {
		ret = ret.replace(from.replace(":80", ""), to);

	}

	return ret;
}

String.prototype.removeDomainName = function(from, level) {		
	var ret = this.replace(from, ".");
	console.log("repalce from " + from );
	if (from.indexOf(":80") >= 1) {
		ret = ret.replace(from.replace(":80", ""), ".");

		console.log("repalce from substring " + from.replace(":80", "") );
	}

	if (level === undefined) {
		from = from.substring( from.indexOf(".") );

		ret = ret.removeDomainName(from, 1);
	}

	return ret;
}
propEquals = function(x, y, blackList) {
	x = x || {};

//	if (Object.keys(y).length != Object.keys(x).length) return false;
	var cnt=0;

	for (var p in y) {		
		if (blackList && blackList.indexOf(p) >= 0) {
			if (x[p]) cnt++;
		} else {
			cnt++;
			if (typeof(y[p]) !== typeof(x[p])) 
				return false;
			if ((y[p] === null) !== (x[p] === null)) 
				return false;
			switch (typeof(y[p])) {
			case 'undefined':
				if (typeof(x[p]) != 'undefined') 
					return false;
				break;
			case 'object':
				if (y[p] !== null && x[p] !== null && (y[p].constructor.toString() !== x[p].constructor.toString() || !propEquals(x[p], y[p])))
					return false;
				break;
			case 'function':
				break;
			default:
				if (y[p] !== x[p])
					return false;
			}
		}
	}
	return cnt===Object.keys(x).length;
}

module.exports.reverseProxyRoute = function(name, serviceCfg, app) {
	var headerBlackList = ["", "cookie", "referer", "connection", "accept-language", "x-requested-with", "user-agent", "accept", "accept-encoding", "accept-charset"];
	var mockCache = {};


	app.use("/" + name, function(req, res, next) {
		var optionProxyCfg = {
			headers: req.headers,
			method: req.method,
			host: url.parse(serviceCfg.proxy).hostname,
			port: url.parse(serviceCfg.proxy).port || 80,
			path: serviceCfg.proxy + ((req.url.length > 1) ? req.url : "")
		};

		var replaceToHostName = req.headers.host;
		var replaceFromHostName = optionProxyCfg.host + ":" + optionProxyCfg.port;
		optionProxyCfg.headers.host = optionProxyCfg.host;

		/* only for fidder */
//		optionProxyCfg.host = "127.0.0.1";
//		optionProxyCfg.port = "8888";
		/* only for fidder */

		console.log("transparent proxy");
		console.log("\t from: " + req.path);
		console.log("\t to  : " + optionProxyCfg.path);

		var folder = cfg.rootDir + serviceCfg.mockFolder + req.path;

		if (serviceCfg.mode === "replay") {
			var retData;

			if (!mockCache[req.path + req.method]) {
				mockCache[req.path + req.method] = [];
				console.log("root dir " + cfg.rootDir);
				var file, fileStata, fileJson;

				try {
					fileStata = fs.lstatSync(folder);
				} catch (e) {};

				if (fileStata && fileStata.isDirectory()) {
					var files = fs.readdirSync(folder);
					for (fileIndex = 0; fileIndex < files.length; fileIndex++) {
						var fileN = files[fileIndex];
						if (fileN.indexOf(req.method) == 0) {
							file = fs.readFileSync(folder + "/" + fileN, 'utf8');
							fileJson = JSON.parse(file.toString());
							mockCache[req.path + req.method].push(fileJson);
						}
					}
				}
			}

			if (mockCache[req.path + req.method]) {
				var dataUrlMatch, dataUrlBodyMatch, dataUrlBodyHeaderMatch;
				for (dataIndex = 0; dataIndex < mockCache[req.path + req.method].length; dataIndex++) {
					var data = mockCache[req.path + req.method][dataIndex];
					if (propEquals(data.requestUrl, req.query)) {
						dataUrlMatch = data;
						if (propEquals(data.requestBody, req.body)) {
							dataUrlBodyMatch = data;
							if (propEquals(data.requestHeader, req.headers, headerBlackList)) {
								dataUrlBodyHeaderMatch = data;
							}
						}
					}
				}
				retData = dataUrlBodyHeaderMatch || dataUrlBodyMatch || dataUrlMatch || mockCache[req.path + req.method][0];
			}

			if (retData) {
				var replaceFromHostName = url.parse(retData.requestHeader.referer).host;
				res.writeHead(retData.responseStatusCode, JSON.parse(JSON.stringify(retData.responseHeader).replaceRemoteLocalName(replaceFromHostName, replaceToHostName)));
				res.write(JSON.stringify(retData.responseBody).replaceRemoteLocalName(replaceFromHostName, replaceToHostName));
			} else {
				res.writeHead(404, "No Mock data avalible !!!");
			}

			res.end();
		} else {
			var recordingStream, responseBodyStr = '';
			var requestBodyStr = JSON.stringify( req.body );
			var fileName = req.method + "_Recorded_" + uuid.v4() + ".json";

			if (serviceCfg.mode === "recording") {
				helperCreateDir(folder);

				recordingStream = fs.createWriteStream(folder + "/" + fileName, {
					flags: 'w',
					encoding: "utf8"
				});
				recordingStream.write("{");
				recordingStream.write('"requestUrl": ' + JSON.stringify(req.query));
				recordingStream.write(',"requestBody": ' + requestBodyStr);
				recordingStream.write(',"requestHeader":' + JSON.stringify(req.headers));
			}

			var proxyReq = http.request(optionProxyCfg, function(proxyRes) {
				proxyRes.headers["Cache-Control"] = "no-cache";				

				// just remove any dmonain attributes in the cookie
				if ((proxyRes.headers) && (proxyRes.headers["set-cookie"])) {
					for (var hIndex in proxyRes.headers["set-cookie"]) {
						cookieValues = proxyRes.headers["set-cookie"][hIndex].split(";");
						newCookieValueStr = "";						
						for (cookieVIndex in cookieValues) {
							if (cookieValues[cookieVIndex].indexOf("domain") === -1) {
								newCookieValueStr += cookieValues[cookieVIndex] + ";";
							}
						}
						proxyRes.headers["set-cookie"][hIndex] = newCookieValueStr;
					}
				}
				var headerStr = JSON.stringify(proxyRes.headers).replaceRemoteLocalName(replaceFromHostName, replaceToHostName);				

				res.writeHead(proxyRes.statusCode, JSON.parse(headerStr));

				if (recordingStream) {
					recordingStream.write(',"responseHeader": ' + headersJson);
					recordingStream.write(',"responseStatusCode": "' + proxyRes.statusCode + '"');
				}			

				proxyRes.pipe( res );

				proxyRes.on('data', function(chunk) {
					responseBodyStr += chunk.toString();
				});

				proxyRes.on('end', function() {
					responseBodyStr = responseBodyStr.replaceRemoteLocalName(replaceFromHostName, replaceToHostName);
					if (recordingStream) {					
						if ((responseBodyStr[0] !== "[") && (responseBodyStr[0] !== "{") &&
						    (responseBodyStr[0] !== "'") && (responseBodyStr[0] !== '"') )
						{
							responseBodyStr = JSON.stringify(responseBodyStr);
						}
						recordingStream.write(',"responseBody": ' + responseBodyStr + '}');
						recordingStream.end();
					}
				});
			});

			
			req.on('data', function(chunk) {
					console.log('Proxy BODY: ' + chunk);
					proxyReq.write(chunk);
			});

			if (requestBodyStr !== "{}") {
				proxyReq.write(requestBodyStr);
			}

			proxyReq.on("error", function(e) {
				if (e.code === "ECONNREFUSED" || e.syscall === "getaddrinfo") {
//					res.writeHead(404, e);
				} else {
//					res.writeHead(500, e);
				}
				console.log("error " + e.message);

//				res.end();
			})
			proxyReq.end();
		}
	});
}

helperCreateDir = function(dirPath) {
	var exfolder = path.existsSync(dirPath);
	if (!exfolder) {
		var subPath = dirPath.substring(0, dirPath.lastIndexOf("/"));
		helperCreateDir(subPath);
		fs.mkdirSync(dirPath);
	}
}