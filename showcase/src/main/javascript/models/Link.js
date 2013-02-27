steal("jquery/model",
	"common_ux_js_lib_internal/jsmvc/controls/HPAjax.js",
	
	function(){
	$.Model("Link",{
		create  : {src: "PUT /users/{userid}/links",retry:false},
		destroy  : {src: "DELETE /users/{userid}/{id}",retry:false},
		findOne : {src: "GET /users/{userid}/links/{id}",retry:false},
		findAll : {src: "GET /users/{userid}/links",retry:false},
		update  : {src: "PUT /users/{userid}/links/{id}",retry:false}
	},{});
});