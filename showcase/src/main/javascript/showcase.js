steal('jquery',
		function() {
			$(document).ready(function($) {
				$(".waitscreen").fadeOut(500,function(){
						$(this).remove();
						$(document.body).html("Hello world");
				});
			});
		}
);