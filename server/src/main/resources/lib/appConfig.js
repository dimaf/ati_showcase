var program = require('commander');
var fs = require('fs');


var AppConfig= function() {
	var args = process.argv;
	program.version('0.0.1')
		.option('-p, --production', 'Use production configuration', false)
		.option('-P, --port <port>', 'Port to use', parseInt)
		.option('-c, --config [cfgFileName]', 'Configuration file to use', 'UXTestServer.json');

	program.command('*').description('Display error on unsupported option').action(function(env) {
		console.log("Unsupported option see --help for suported options ")
		process.exit(code = 0)
	});

	program.parse(args);

	if (program.production) {
		this.prod = true;
		console.log("Runnig in production mode.")
	}

	cfgFileName = program.config;
	console.log("Use Config file: " + cfgFileName);

	data = fs.readFileSync(cfgFileName);

	this.cfg = JSON.parse(data);
	this.cfg.port = program.port || this.cfg.port || 8080;

	this.cfg.rootDir = __dirname +  this.cfg.rootDir;	
}

AppConfig.prototype = {
	cfg: this.cfg,
	prod: this.prod
}

module.exports = new AppConfig();
