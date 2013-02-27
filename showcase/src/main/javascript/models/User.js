steal("jquery/model",
	
	function(){
	$.Model("User",{
		create  : {src: "PUT /users",retry:false},
		destroy  : {src: "DELETE /users/{id}"},
	//	findOne : {src: "GET /users/{id}"},
		findAll : {src: "GET /users"},
	//	update  : {src: "PUT /users/{id}"}

	},{})
})