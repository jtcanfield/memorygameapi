const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://databaseedit:timetoeditthedb@ds139904.mlab.com:39904/memorygamedb';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://databaseedit:timetoeditthedb@ds139904.mlab.com:39904/memorygamedb');
//Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get("/", function (req, res) {
  res.send("Hello");
});
app.post("/stats/:playername", function (req, res) {
  console.log(req.params.playername);
  MongoClient.connect(mongoURL, function (err, db) {
    const statsdb = db.collection("statistics");
    statsdb.insertOne({playername: req.params.playername, time: "instant"});
    return
  })
});
app.get("/listing", function (req, res) {
  MongoClient.connect(mongoURL, function (err, db) {
    const statsdb = db.collection("statistics");
    statsdb.find().toArray(function (err, docs) {
      // res.send(docs);
      res.json(docs);
      // JSON.stringify(docs)
      return docs
    })
  })
});
app.listen(process.env.PORT || 5000, function () {
  console.log('Hosted on local:5000 or Dynamic');
})
MongoClient.connect(mongoURL, function(err, db) {
  if (err){
    console.log("ERROR");
    console.log(err);
  }
  console.log("Connected successfully to server at " + mongoURL);
  db.close();
});
