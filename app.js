//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");




const homeStartingContent = "Welcome write your daily moments";
const aboutContent = "@yas web webdeveloper";
const contactContent = "email : xyz@gmail.com contact : +1 11111111";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//mongodb connection using mongoose

  mongoose.connect("mongodb://localhost/dailygernalDB", {useNewUrlParser : true});

  const dataschema = {
    title : String,
    content : String
  };

  const datamodel = mongoose.model("Note",dataschema);


//END
let posts = [];


app.get("/", function(req, res){
  
  datamodel.find({},(err,founddata) =>
  {
    if(founddata == null)
    {
      datamodel.insertOne("Your Personal dairy",(err) =>
      {
        if(err) console.log("data is empty");
        else console.log("data is inserted successfully");
      });

      res.redirect("/");

    }
    else{
    res.render("home", {
      startingContent: homeStartingContent,
      posts: founddata
      });}
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  
  const titlei = req.body.postTitle;
  const des = req.body.postBody;

  const item = new datamodel(
    {
      title : titlei,
      content : des
    }
  );

  item.save();  
  res.redirect("/");
});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);



  datamodel.findOne({title : requestedTitle},(err,founddata) =>
  {
      if(err) console.log("data is empty");
      else
      {
        
        res.render("post",
        {
          title : founddata.title,
          content : founddata.content == null ? "opps note is empty" : founddata.content
        });
      }
  });
  


});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
