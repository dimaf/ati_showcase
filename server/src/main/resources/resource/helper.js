var express = require('express');
var fs = require('fs');


module.exports.readJSONFile= function (filename) {
	var dateStr = fs.readFileSync(filename, "UTF8");
	return JSON.parse(dateStr);
}

module.exports.readJSONFiles= function (folder) {	
	var files = fs.readdirSync(folder);
	var ret = [];
	for (fileIndex = 0; fileIndex < files.length; fileIndex++) {
		var file = folder + "/" + files[fileIndex];
		if (fs.statSync(file).isFile()) {
			ret.push(module.exports.readJSONFile( file ));
		}
	}

	return ret;
}

module.exports.exceptionResponse = function(res, code, text) {
	res.send(400, {errorCode: code, errorText : text});
}
