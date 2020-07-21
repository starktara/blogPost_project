//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb://localhost:27017/blogPostDB", {useNewUrlParser: true, useUnifiedTopology: true});

const blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    requried: true
  },
  content: {
    type: String,
    requried: true
  }
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  BlogPost.find({}, function(err, posts){
    if(!err){
      res.render("home", {posts: posts});
    }
  })  
})

app.get("/about", function(req, res){
  res.render("about");
})

app.get("/contact", function(req, res){
  res.render("contact");
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", function(req, res){
  BlogPost.findOne({title: req.body.postTitle}, function(err, existPost){
    if(!err){

      if(existPost){
        res.redirect("/posts/"+ existPost._id);
      } else {
        const newPost = new BlogPost({
          title: req.body.postTitle,
          content: req.body.postContent
        });
        newPost.save(function(err){
          if(!err){
            res.redirect("/");
          }
        }); 
      } 
    }
  })
})

app.get("/posts/:blogId", function(req, res){
  const urlName = req.params.blogId;
  BlogPost.findById(urlName, function(err, post){
    if(!err){
      res.render("post", {blogPostTitle: post.title, blogPostContent: post.content});
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
