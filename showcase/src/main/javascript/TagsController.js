steal("jquery/controller","jquery/view","jquery/view/ejs","jquery/controller/view",function(){
	$.Controller("TagsController",{},{
		init:function(){
			this.element.html(this.view("//showcase/TagsView.ejs",$.ajax("/users/"+this.options.name+"/tags")))
			steal.dev.log("Finish init")
		}
	})
})