steal("jquery/model",
	
	function(){
	$.Model("User",{
		create  : {src: "PUT " + $.getServiceUrlPrefix() + "/users",retry:false},
		destroy : {src: "DELETE " + $.getServiceUrlPrefix() + " /users/{id}"},
	//	findOne : {src: "GET /users/{id}"},
		findAll : {src: "GET " + $.getServiceUrlPrefix() + "/users"}
	//	update  : {src: "PUT /users/{id}"}

	},{});
});