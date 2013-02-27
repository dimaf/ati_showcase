/*globals TagsController*/
steal('jquery','showcase/TagsController.js',
		function() {
			$(document).ready(function($) {
				$(".waitscreen").fadeOut(500,function(){
						$(this).remove();
						var tags=new TagsController($(document.body),{name:"ralf"});
				});
			});
		}
);