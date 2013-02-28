steal("funcunit/qunit", 
	"funcunit").then(
	  "showcase/TagsController.js",
	  function(){

	module("common_ux_js_lib_internal HPText");

	test("HPText test", function(el){
		var elem = $("<div></div>").appendTo( $("#qunit-test-area") );
		new TagsController(elem,{name:"ralf"});
		elem.remove()
	});
});