steal(
	'jquery/controller',	// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/controller/view',		// lookup views with the controller's name
	'jquery/model',					// Ajax wrappers
	'jquery/dom/fixture',			// simulated Ajax requests
	'jquery/dom/form_params',	    // form data helper
	'jquery/model/validations',
	"funcunit/qunit", 
	"funcunit",
	'steal/less')
.then(function($){
	bootstrapperDefaults = {session:"false",unittest:true};

	if (steal.instrument && steal.instrument.ignores) {
		steal.instrument.ignores.push("*common_ux_js_lib_thirdparty");
	}
	
})
;