var express = require('express');
var path = require('path');
var url = require('url');
var fs = require('fs');
var reverseProxy = require('./lib/reverseProxy.js')
var exUtil = require('./lib/expressUtils.js');
var appConfig = require('./lib/appConfig');
var cfg = appConfig.cfg;

//delete express.bodyParser.parse['application/x-www-form-urlencoded'];
var app = express();
app.use(express.logger({
		format: ':method :status :response-time :url'
	}));
//app.use(express.bodyParser());
app.use(express.multipart());
app.use(express.json({strict: false}));

app.use(express.cookieParser());

var jsMVCApps = {};



trim = function(string) {
	return string.replace(/^\s+/g, '').replace(/\s+$/g, '');
}

readConfigFile = function(path, next) {
	console.log("path:" + path);
	fs.readFile(path, function(err, data) {
		if (err) throw err;
		var ret = {};

		data.toString().split('\n').forEach(function(line) {
			var keyValueA = line.trim().split('=');
			if (keyValueA && keyValueA.length === 2) {
				ret[keyValueA[0]] = keyValueA[1];
			}
		});

		next(ret);
	});
}

init = function() {

	require('./resource/tags.js').tagsResource(app, {mockFolder: __dirname + "/resourceData/tags/"});

	app.use("/webapp/app.apk", function(req, res, next) {
		fs.readdir(cfg.rootDir + cfg.webAppFolder + "/target", function(err, list) {
			if (err) return next(err);
			var apkFilePath;

			for (i = 0; i < list.length; i++) {
				stat = fs.statSync(cfg.rootDir + cfg.webAppFolder + "/target/" + list[i]);

				if (stat && stat.isFile() && (list[i].indexOf("-android.zip") >= 1)) {
					apkFilePath = cfg.rootDir + cfg.webAppFolder + "/target/" + list[i];
				}
			}

			if (apkFilePath) {
				var fileStream = fs.createReadStream(apkFilePath);
				fileStream.pipe(res);
			} else {
				res.send(404);
			};
		});
	});

	if (appConfig.prod) {
		app.use("/webapp", express.static(cfg.rootDir + cfg.webAppFolder + "/target/" + cfg.webAppFolder));
	} else {
		// mock Service
		app.use("/webapp/rest/mock", function(req, res, next) {
			var urlParse = req.url.indexOf("?") >= 0 ? req.url.substring(0, req.url.indexOf("?")) : req.url;
			var filename = cfg.rootDir + cfg.webAppFolder + "/src/main/resources" + urlParse;
			fs.exists(filename, function(exists) {
				if (!exists) {
					res.send(404);
				} else {
					var fileStream = fs.createReadStream(filename);
					fileStream.pipe(res);
				}
			});			
		});

		// more or less only for the index.html page
		app.use("/webapp", express.static(cfg.rootDir + cfg.webAppFolder + "/src/main/webapp"));

		app.use("/webapp/build", express.static(cfg.rootDir + cfg.webAppFolder + "/target/" + cfg.webAppFolder + "/build"));

		console.log("Folder Routes");
		for (var folderKeyNames in cfg.folderRoute) {
			if (cfg.folderRoute.hasOwnProperty(folderKeyNames)) {
				console.log("\t" + folderKeyNames + " --> " + cfg.folderRoute[folderKeyNames]);
				app.use(folderKeyNames, express.static(cfg.rootDir + cfg.folderRoute[folderKeyNames]));
			}
		}

		console.log("JSMVC App Routes");
		for (var jsmvcKeyNames in cfg.jsmvcRoute) {
			if (cfg.jsmvcRoute.hasOwnProperty(jsmvcKeyNames)) {
				console.log("\t" + jsmvcKeyNames + " --> " + cfg.jsmvcRoute[jsmvcKeyNames]);
				jsMVCApps[jsmvcKeyNames] = "live ...";
				exUtil.regJSMVCApp(jsmvcKeyNames, cfg.jsmvcRoute[jsmvcKeyNames], cfg.rootDir, app);
			}
		}

		app.use("/webapp/package.json", function(req, res, next) {
			fs.readFile(cfg.rootDir + cfg.webAppFolder + "/src/main/resources/package.json", function(err, data) {
				if (err) throw err;

				var packageCFG = JSON.parse(data);
				packageCFG.dependencies = jsMVCApps;

				res.send(packageCFG);
			});
		});
	};

	if (cfg.serviceRoute) {
		console.log("ServiceRoute");
		for (var serviceRoute in cfg.serviceRoute) {
			if (cfg.serviceRoute.hasOwnProperty(serviceRoute)) {
				console.log("\t" + serviceRoute);
				console.log("\t\t mockFolder --> " + cfg.serviceRoute[serviceRoute].mockFolder);
				console.log("\t\t mode --> " + cfg.serviceRoute[serviceRoute].mode);
				console.log("\t\t proxy --> " + cfg.serviceRoute[serviceRoute].proxy);
				reverseProxy.reverseProxyRoute(serviceRoute, cfg.serviceRoute[serviceRoute], app);
			}
		}
	}
}

console.log("Use port: " + cfg.port)
console.log("root dir " + cfg.rootDir);

init();

app.listen(cfg.port, '0.0.0.0');