steal("jquery/model",
	"common_ux_js_lib_internal/jsmvc/controls/HPAjax.js",
	
	function(){
	$.Model("Tag",{
		create  : {src: "put " + $.getServiceUrlPrefix() + "/users/{userid}/tags",retry:false},
		destroy : {src: "DELETE " + $.getServiceUrlPrefix() + "/users/{userid}/tags/{id}",retry:false},
		findOne : {src: "GET " + $.getServiceUrlPrefix() + "/users/{userid}//tags/{id}",retry:false},
		findAll : {src: "GET " + $.getServiceUrlPrefix() + "/users/{userid}/tags",retry:false},
		update  : {src: "PUT " + $.getServiceUrlPrefix() + "/users/{userid}/tags/{id}",retry:false}
	},{});
});