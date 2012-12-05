var express = require('express');
var fs = require('fs');

module.exports.fileRoute = fileRoute = function(filePath) {
	return function(req, res, next) {
		fs.readFile(filePath, function(err, data) {
			if (err || !data) {
				next();
			} else {
				res.send(data.toString());
			}
		});
	}
};

module.exports.regJSMVCApp = function(appName, path, rootDir, app) {
	app.get("/webapp/" + appName + "/package.json", fileRoute(rootDir + path + "/src/main/resources/package.json"));
	app.get("/webapp/" + appName + "/changelog.json", fileRoute(rootDir + path + "/src/main/resources/changelog.json"));
	app.get("/webapp/" + appName + "/releaseNotes.json", fileRoute(rootDir + path + "/src/main/resources/releaseNotes.json"));

	app.get("/webapp/" + appName + "/qunit.html", fileRoute(rootDir + path + "/src/test/javascript/qunit.html"));
	app.get("/webapp/" + appName + "/qunit_.html", fileRoute(rootDir + path + "/src/test/javascript/qunit_.html"));
	app.get("/webapp/" + appName + "/funcunit.html", fileRoute(rootDir + path + "/src/test/javascript/funcunit.html"));

	app.use("/webapp/" + appName + "/test", express.static(rootDir + path + "/src/test/javascript/test"));

	app.use("/webapp/" + appName, express.static(rootDir + path + "/src/main/javascript"));
};
