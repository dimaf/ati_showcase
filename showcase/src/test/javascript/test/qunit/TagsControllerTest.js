steal("funcunit/qunit", 
	"funcunit").then(
	  "showcase/TagsController.js",
	  function(){

	module("TagsController Test");

	test("Empty test", function(el){
		var elem = $("<div></div>").appendTo( $("#qunit-test-area") );
		new TagsController(elem,{name:"ralf"});
		elem.remove()
	});
});