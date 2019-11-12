var express = require('express');
var exphbs = require('express-handlebars');
var favicon = require('serve-favicon');

var app = express();

app.disable('x-powered-by');
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(favicon(__dirname + '/public/img/favicon.ico'));

//home page
app.get('/', function(req, res){
	res.render('home', {user: 'oscar'});
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
app.post('/process', function(req, res){
	console.log('Form = ' + req.query.form);
	switch (req.query.form) {
		case 'login':
			//check login in db
		case 'register':
			// create new user in mongodb
		case 'report':
			// create new report in mongodb
		default:
			console.log('Problem with form switch');
	}
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
