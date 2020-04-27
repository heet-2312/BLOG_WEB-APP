var express=require("express");
var app=express();
methodOverride= require("method-override");
expressSanitizer=require("express-sanitizer");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
//APP CONFIG
mongoose.set("useUnifiedTopology",true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/restful_blog_app",{
	useNewUrlParser:true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.set("view engine","ejs");


//MONGOOSE MODEL CONFIG
var blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	Created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
//INDEX ROUTE
app.get("/",function(req,res){
	res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERROR");
		}
		else
		{
			res.render("index",{blogs:blogs})
		}
	});
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
})
//CREATE ROUTE
//Blog.create(Data base me dala kyuki mongoose mode ka name Blog he)fir redirect kiya blogs variable ke saath fir index.ejs me paas kiya dispay karne ke liye
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	})
	//res.send("SHOW PAGE!");
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	});
});


//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,upadteBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});


app.listen(3000,function(){
	console.log("RESTFUL Server");
});
