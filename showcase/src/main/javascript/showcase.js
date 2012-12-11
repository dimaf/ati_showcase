steal('jquery',
		function() {
			$(document).ready(function($) {
				$(".waitscreen").fadeOut(500,function(){
						$(this).remove();
						$.ajax("/users/ralf/tags").done(function(data){
							$(document.body).html("Ralf's tags: "+JSON.stringify(data));
						});
				});
			});
		}
);