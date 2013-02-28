steal("funcunit/qunit", 
	"funcunit").then(
	  "showcase/TagsController.js",
	  function(){

	module("common_ux_js_lib_internal HPText");

	test("HPText test", function(el){
		equal("test","test");
	});
});