/*globals TagsController*/
steal('jquery',"steal/less")
.then("common_ux_js_lib_thirdparty/bootstrap/less/bootstrap.less",
	'showcase/TagsController.js',
		function() {
			$(document).ready(function($) {
				$(".waitscreen").fadeOut(500,function(){
						$(this).remove();
						var tags=new TagsController($(document.body),{name:"ralf"});
				});
			});
		}
);