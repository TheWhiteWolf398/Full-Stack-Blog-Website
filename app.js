//jshint esversion:6
 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
 
const homeStartingContent = "Hello";
const aboutContent = "Welcome to Abhishek's blog, express your stories and your days freely and safely.";
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
mongoose.set('strictQuery', true);
 
mongoose.connect('mongodb://127.0.0.1:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`CONNECTED TO MONGO!`);
    })
    .catch((err) => {
        console.log(`OH NO! MONGO CONNECTION ERROR!`);
        console.log(err);
    })
 
const postSchema = {
  title: String,
  content: String
};
 
const Post = mongoose.model("Post", postSchema);
 
const posts = [];
 
app.get("/", function(req, res){
 
  Post.find({})
  .then(function(posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});
 
app.get("/compose", function(req, res){
  res.render("compose");
});
 
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
 
 
  post.save();
  res.redirect("/");
});
 
app.get("/posts/:postId", function(req, res){
 
const requestedPostId = req.params.postId;
 
  Post.findOne({_id: requestedPostId})
  .then(function( post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
 
});
 
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});
 
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});
 
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});