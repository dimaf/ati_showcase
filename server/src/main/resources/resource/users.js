var express = require('express');
var fs = require('fs');
var helper = require('./helper.js');


module.exports.tagsResource = function(app, options) {	

	/*
	*
	*	User Links 
	*
	*/

	app.get("/users", function(req, res) {
		var users = [];

		var files = fs.readdirSync(options.mockFolder);
		for (fileIndex = 0; fileIndex < files.length; fileIndex++) {
			users.push( {name: files[fileIndex] } );
		}

		res.send(users);
	});

	app.put("/users", function(req, res) {
		if (!req.body.name) {
			helper.exceptionResponse(res, 102, "Invalid Request");
		} else {
			var userName = req.body.name.toLowerCase();
			if (fs.existsSync( options.mockFolder + userName )) {
				helper.exceptionResponse(res, 102, "User " + userName + " is already avalible");
			} else {
				fs.mkdirSync( options.mockFolder + userName  );
				fs.mkdirSync( options.mockFolder + userName + "/tags" );
				fs.mkdirSync( options.mockFolder + userName + "/links" );
				res.send();
			}
		}
	});

	/*
	*
	*	User Tags Resource
	*
	*/

	app.get("/users/:UID/tags", function(req, res) {
		try {
			res.send( helper.readJSONFiles(options.mockFolder + req.params.UID.toLowerCase() + "/tags" ) );
		} catch (error) {
			helper.exceptionResponse(res, 100, "No Data");
		}
	});

	app.get("/users/:UID/tags/:TagID", function(req, res) {
		try {
			var tag = helper.readJSONFile( options.mockFolder + req.params.UID.toLowerCase() + "/tags/" + req.params.TagID.toLowerCase() + ".json");
			res.send(tag);
		} catch (error) {
			helper.exceptionResponse(res, 100, "No Data");
		}
	});	

	app.put("/users/:UID/tags", function(req, res) {
		var tag = {
			visibility : "private",
			name       : req.body.name,
			description: req.body.description || ""
		};

		if (!req.body.name) {
			helper.exceptionResponse(res, 102, "Invalid Request");
		} else {
			try {
				fs.writeFileSync( options.mockFolder + req.params.UID.toLowerCase() + "/tags/" + req.body.name.toLowerCase() + ".json", JSON.stringify(tag) );
				res.send(tag);
			} catch (error) {
				helper.exceptionResponse(res, 99, "Internal Error");
			}
		}
	});	

	app.delete("/users/:UID/tags/:TagID", function(req, res) {
		try {
			fs.unlinkSync( options.mockFolder + req.params.UID.toLowerCase() + "/tags/" + req.params.TagID.toLowerCase() + ".json" )
			res.send();
		} catch (error) {
			helper.exceptionResponse(res, 99, "Internal Error");
		}
	});	


	/*
	*
	*	User Links Resource
	*
	*/

	app.get("/users/:UID/links", function(req, res) {
		try {
			var links = helper.readJSONFiles( options.mockFolder + req.params.UID.toLowerCase() + "/links" );
			res.send(links);
		} catch (error) {
			helper.exceptionResponse(res, 100, "No Data");
		}
	});	

	app.put("/users/:UID/links", function(req, res) {
		var link = {
			name : req.body.name,
			link : req.body.link,
			description : req.body.description,
			tags : []
		};

		if (!req.body.name || !req.body.link) {
			helper.exceptionResponse(res, 102, "Invalid Request");
		} else {
			for (var tagnr in req.body.tags) {
				var tag = req.body.tags[tagnr];
				if (tag.name) {
					link.tags.push ( {
						name : tag.name,
						visibility : tag.visibility === "public" ? "public" : "private"
					});
				}
			}

			try {
				fs.writeFileSync( options.mockFolder + req.params.UID.toLowerCase() + "/links/" + req.body.name.toLowerCase() + ".json", JSON.stringify(link) );				
				res.send();
			} catch (error) {
				helper.exceptionResponse(res, 99, "Internal Error");
			}
		}
	});	

	app.get("/users/:UID/links/:LinkID", function(req, res) {
		try {
			var link = helper.readJSONFile( options.mockFolder + req.params.UID.toLowerCase() + "/links/" + req.params.LinkID.toLowerCase() + ".json");
			res.send(link);
		} catch (error) {
			helper.exceptionResponse(res, 100, "No Data");
		}
	});	

	app.delete("/users/:UID/links/:LinkID", function(req, res) {
		try {
			fs.unlinkSync( options.mockFolder + req.params.UID.toLowerCase() + "/links/" + req.params.LinkID.toLowerCase() + ".json");
			res.send();
		} catch (error) {
			helper.exceptionResponse(res, 99, "Internal Error");
		}
	});	


}