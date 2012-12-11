load('steal/rhino/rhino.js')
steal('steal/build/packages', function(){
	steal.build.packages('./build-en-US-flyaway.html',{minify:true})
})