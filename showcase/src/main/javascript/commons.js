steal('common_ux_js_lib_thirdparty/bootstrap/js/bootstrap-button.js',
	'common_ux_js_lib_thirdparty/bootstrap/js/bootstrap-modal.js',
	'common_ux_js_lib_thirdparty/bootstrap/js/bootstrap-alert.js',
	'common_ux_js_lib_internal/waitscreen',
	'common_ux_js_lib_internal/jsmvc/controller/controller.resourcebundle.js',
	'common_ux_js_lib_internal/jquery/jquery.confirm.bootstrap.js',
	'common_ux_js_lib_internal/helper/designerHelper.js',function(){
		$.ajaxSetup({
			contentType : 'application/json',
			accepts : {
				json : 'application/json'
			},
			processData : false,
			dataType : "json"

		});
		$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
			if (options.data && options.dataType !== "text") {
				if (options.type === "GET") {
					options.data = jQuery.param(options.data,true);
				} else {
					if(options.data.serialize){
						options.data = options.data.serialize();
					}
					options.data = JSON.stringify(options.data);

				}
			}
		});
	});