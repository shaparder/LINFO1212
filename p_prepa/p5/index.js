var express = require('express');
var exphbs = require('express-handlebars');
var favicon = require('serve-favicon');
var mongo = require('mongodb');

var app = express();
var MongoClient = mongo.MongoClient;
var db_url = 'mongodb://localhost:27017';

app.disable('x-powered-by');
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(favicon(__dirname + '/public/img/favicon.ico'));

//home page
app.get('/', function(req, res){
	var regex = new RegExp(req.query.search, "gi");
	var search = {$or: [{desc: regex}, {envn: regex}, {user: regex}, {date: regex}]};
	console.log(search);
	MongoClient.connect(db_url, {useUnifiedTopology: true}, function(err, client){
		if(err){
			console.log('connection to server failed: ', err);
		} else {
			console.log('connected to server');
			var collection = client.db('p_prepa_db').collection('reports');
			collection.find(search).toArray((error, result)=>{
				console.log(result);
				if (error){
					console.log('error query collection', error);
				}
				if (result.length){
					res.render('home', {user: 'oscar', reports: result});
				} else {
					res.render('home', {user: 'oscar'});
				}
			});
			client.close();
		}
	});
});

app.use(function(req, res, next) {
	console.log('Looking for url : ' + req.url);
	next();
});

// login page
app.get('/login', function(req, res){
	res.render('login', {user: 'oscar'});
});

//report page
app.get('/report', function(req, res){
	res.render('report', {user: 'oscar'});
});

//process post request from forms
app.post('/processlogin', function(req, res){
	console.log('Form = ' + req.query.form);
	switch (req.query.form) {
		case 'login':
			//check login in db
		case 'register':
			// create new user in mongodb
		default:
			console.log('Problem with form switch');
	}
});

app.post('/processreport', function(req, res){
	var month_array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var n = new Date();
	var date = n.getDate() + ' ' + month_array[n.getMonth()] + ' ' + n.getFullYear();
	var report = {desc: req.body.desc, envn: req.body.envn, user: 'oscar', date: date};
	MongoClient.connect(db_url, {useUnifiedTopology: true}, function(err, client){
		if(err){
			console.log('connection to server failed: ', err);
		} else {
			console.log('connected to server');
			var collection = client.db('p_prepa_db').collection('reports');
			collection.insertOne(report, function(error, result){
				if (error) console.log('couldnt add new report', error);
				else console.log('successfully added new report');
			});
			client.close();
		}
	});
	res.redirect('/');
});

app.use(function(req, res) {
	res.type('text/html');
	res.status(404);
	res.render('404');
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), (err) => {
	if (err)
		throw err;
	console.log('server listening on port ' + app.get('port'));
});
