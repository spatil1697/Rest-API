//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true});

const articlesSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articlesSchema);


// Request targeting all the articles
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added")
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Succefully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });


// Request targeting single articles
app.route("/articles/:articleTitle")
  .get(function(req, res) {

    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching to that title");
      }
    });
  })

  .put(function(req, res) {
    Article.update(
      {title: req.params.articleTitle},
      {  title: req.body.title, content: req.body.content},
      {overwrite:true},
    function(err){
      res.send("Succefully updated articles")
    });
  })


.patch(function(req,res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
      res.send("Succesfully updated article.");
    }else{
      res.send(err);
    }
  });
})


.delete(function(req,res){
  Article.deleteOne({title: req.params.articleTitle},function(err){
    if(!err){
      console.log("Succefully deleted the article");
    }else{
      console.log(err);
    }
  });

});


app.listen(3000, function() {
  console.log("server started on port 3000");
});
