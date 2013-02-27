/*globals Tag User Link*/
steal("jquery/controller",
	"jquery/view",
	"jquery/view/ejs",
	"jquery/controller/view",
	"steal/less",
	"showcase/models/Tag.js",
	"showcase/models/User.js",
	"showcase/models/Link.js",
	"showcase/commons.js").then(
	
	function(){
	$.Controller("TagsController",{},{
		init:function(){
			this.element.html(this.view("//showcase/views/main.ejs"));
			this.find("#myModal").modal({backdrop: 'static'});
		},
		"#login click":function(el,ev){
			this.userName=this.find("#user").val();
			var self=this;
			Tag.findAll({userid:this.userName}).done(function(data){
				self.find("#main").html("//showcase/views/tags.ejs",data);
				self.find("#myModal").modal("hide");
			}).fail(this.proxy("loginFailedHandler"));
			
		},
		"#new-user click":function(el,ev){
			var user=new User({name:this.find("#user").val()});
			var self=this;
			user.save().done(function(data){
				this.userName=data.name;
				self.find("#myModal").modal("hide");
				self.reload();
			}).fail(this.proxy("loginFailedHandler"));
		},
		"#create-tag click":function(){
			var self=this;
			new Tag({
				name:this.find("#TagName").val(),
				description:this.find("#TagDescription").val(),
				userid:this.userName
			}).save().done(this.proxy("reload"))
			.fail(function(data){
				self.find("#create-error").text(data.responseText);
				self.find(".alert").show();

			});
		},
		"#create-link click":function(){
			var self=this;
			new Link({
				name:this.find("#LinkName").val(),
				description:this.find("#LinkDescription").val(),
				link:this.find("#Link").val(),
				userid:this.userName
			}).save().done(this.proxy("reload"))
			.fail(function(data){
				self.find("#create-error").text(data.responseText);
				self.find(".alert").show();

			});
		},
		loginFailedHandler:function(data){
			this.find("#login-error").text(data.responseText);
			this.find(".alert").show();
		},
		"#tags click":function(){
			this.reload();
		},
		"#links click":function(){
			this.find("#main").html(this.view("//showcase/views/links.ejs",Link.findAll({userid:this.userName})));
		},
		reload:function(){
			this.find("#main").html(this.view("//showcase/views/tags.ejs",Tag.findAll({userid:this.userName})));
		}
	});
});