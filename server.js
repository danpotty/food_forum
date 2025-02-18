if(process.env.NODE_ENV !== "production"){
		require("dotenv").load();
}

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var passport = require('passport');
var mongoose = require('mongoose');
require("./models/UserModel");
require("./models/TopicModel");
require("./models/CommentModel");
require("./config/passport");

// mongoose.connect(process.env.MONGO_STRING);
var database = process.env.MONGOLAB || "mongodb://localhost/FailedMongoLab";
console.log(database);
mongoose.connect(database, function(err){
	console.log("Connect");
	if(err) return console.log('error connecting to %s', database);
	console.log('connected to %s', database);
});

app.set('views', path.join(__dirname, 'views'));
//set the view engine that will render HTML from the server to the client
app.engine('.html', require('ejs').renderFile);
//Allow for these directories to be usable on the client side
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
//we want to render html files
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});

//middleware that allows for us to parse JSON and UTF-8 from the body of an HTTP request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(passport.initialize());

var userRoutes = require('./routes/userRoutes');
var topicRoutes = require('./routes/topicRoutes');
var commentRoutes = require('./routes/commentRoutes');


//on homepage load, render the index page
app.get('/', function(req, res) {
	res.render('index');
});

// Use User Routes
app.use("/api/user", userRoutes);
// Use Topic Routes
app.use('/subforum/', topicRoutes);
// Use Comment Routes
app.use('/topic/', commentRoutes);

// Handle Errors
app.use(function(err, req, res, next) {
	console.log(err);
	res.status(400).send(err);
});

var server = app.listen(port, function() {
	var host = server.address().address;
	console.log('Example app listening at http://localhost:' + port);
});
