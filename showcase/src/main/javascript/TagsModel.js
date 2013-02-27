steal("jquery/model",
	"common_ux_js_lib_internal/jsmvc/controls/HPAjax.js",
	
	function(){
	$.Model("Tag",{
		create  : {src: "POST /users/{userid}/tags",retry:false},
		destroy  : {src: "DELETE /users/{userid}/{id}",retry:false},
		findOne : {src: "GET /users/{userid}/{id}",retry:false},
		findAll : {src: "GET /users/{userid}/tags",retry:false},
		update  : {src: "PUT /users/{userid}/{id}",retry:false}
	},{})
})