//APP CONFIG
var express=require("express")
var bodyParser = require("body-parser")
var app=express(),
methodOverride=require("method-override")
mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser:true,useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log("error in connecting to db"))
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride("_method"))
//SCHEMA CONFIG
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
})
//MODEL CONFIG
var Blog=mongoose.model("Blog",blogSchema)
//TEST
// Blog.create({
//     title:"DOGGO",
//     image:"https://images.unsplash.com/photo-1591902076194-d7394f8e24ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
//     body:"DEMO POST"
// },function(req,res){
//    if(err){
//         console.log(err)
//     }
//     else{
//         console.log("DONE")
//     }
// })
//RESTFUL ROUTES
app.get("/",function(req,res){
    res.redirect("/blogs")
})
//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR")
        }
        else{
            res.render("index",{blogs:blogs})
        }
    })
})
//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new")
})
//CREATE ROUTE
app.post("/blogs",function(req,res){
    //sanitize blog body and create blog 
    Blog.create(req.body.blog,function(err,newBlog){
        //redirect
        if(err){
            res.render("new")
        }
        else{
            res.redirect("/blogs")
        }

    })
})
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
        res.redirect("/blogs")
    }
    else{
        res.render("show",{blog:foundBlog})
    }
    })
})
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("edit",{blog:foundBlog})
        }
    })
})
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})
//DELEET ROUTE
app.delete("/blogs/:id",function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs")
        }
    })
})
app.listen(3001,function(){
    console.log("BlogApp running")
})