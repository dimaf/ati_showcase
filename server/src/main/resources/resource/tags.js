var express = require('express');
var fs = require('fs');


module.exports.tagsResource = function(app, options) {

	function readJSONFile(filename) {
		var dateStr = fs.readFileSync(filename, "UTF8");
		return JSON.parse(dateStr);
	}

	function readJSONFiles(folder) {		
		var ret = [], files = fs.readdirSync(folder);
		for (fileIndex = 0; fileIndex < files.length; fileIndex++) {
			ret.push(readJSONFile( folder + "/" + files[fileIndex] ))
		}

		return ret;
	}

	console.log(" tagsResource " + options.mockFolder);

	app.get("/tags", function(req, res) {
		res.send( readJSONFiles(options.mockFolder) );
	});

	app.get("/tags/:TagID", function(req, res) {
		try {
			var tag = readJSONFile( options.mockFolder + req.params.TagID.toLowerCase() + ".json");
			res.send(tag);
		} catch (error) {
			res.send(400, {errorCode: 100, errorText : "No Data"});
		}
		
	});
/*
	app.get("/tags/:UID", function(req, res) {
		res.send({tags:[ {"name":"testName" + req.params.UID, "description":"description name .."} ]});
	});	
*/
	app.get("/tags/:UID/:TagID", function(req, res) {
		try {
			var tag = readJSONFile( options.mockFolder + req.params.UID.toLowerCase() + "/" + req.params.TagID.toLowerCase() + ".json");
			res.send(tag);
		} catch (error) {
			res.send(400, {errorCode: 100, errorText : "No Data"});
		}
	});		

}