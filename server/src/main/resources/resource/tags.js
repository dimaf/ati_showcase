var express = require('express');
var fs = require('fs');
var helper = require('./helper.js');


module.exports.tagsResource = function(app, options) {
	console.log(" tagsResource " + options.mockFolder);

	app.get("/tags", function(req, res) {
		res.send( helper.readJSONFiles(options.mockFolder) );
	});

	app.get("/tags/:TagID", function(req, res) {
		try {
			var tag = helper.readJSONFile( options.mockFolder + req.params.TagID.toLowerCase() + ".json");
			res.send(tag);
		} catch (error) {
			helper.exceptionResponse(res, 100, "No Data");
		}
		
	});

}