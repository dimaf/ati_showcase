steal("jquery/model",
	"common_ux_js_lib_internal/jsmvc/controls/HPAjax.js",
	
	function(){
	$.Model("Link",{
		create  : {src: "PUT " + $.getServiceUrlPrefix() + "/users/{userid}/links",retry:false},
		destroy : {src: "DELETE " + $.getServiceUrlPrefix() + " /users/{userid}/{id}",retry:false},
		findOne : {src: "GET " + $.getServiceUrlPrefix() + "/users/{userid}/links/{id}",retry:false},
		findAll : {src: "GET " + $.getServiceUrlPrefix() + "/users/{userid}/links",retry:false},
		update  : {src: "PUT " + $.getServiceUrlPrefix() + "/users/{userid}/links/{id}",retry:false}
	},{});
});