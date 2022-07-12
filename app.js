const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/wikiDB");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, results) {
      if (!err) res.send(results);
      else res.send(err);
    });
  }).post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("successfully added new article");
      } else {
        res.send(err);
      }
    });
  }).delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully deleted All articles");
      }
    });
  });

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, article) {
      if (err) res.send(err);
      else res.send(article);
    });
  }).put(function(req,res){
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {title: req.body.title,content: req.body.content},
      {upsert: true},
      function(err){
        if(err) res.send(err);
        else res.send("successfully updated!")
      }
    );
  }).patch(function(req,res){
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {content: req.body.content},
      {upsert: true},
      function(err){
        if(err) res.send(err);
        else res.send("successfully updated!");
      }
    );
  }).delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(err)res.send(err);
        else res.send("successfully deleted!");
      }
    );
  });

app.listen(3000, function() {
  console.log("server started at port 3000");
});
