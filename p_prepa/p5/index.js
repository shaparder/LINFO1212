var express = require('express');
var exphbs = require('express-handlebars');
var app = express();

app.disable('x-powered-by');
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('home');
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), (err) => {
	if (err)
		throw err;
	console.log('server listening on port ' + app.get('port'));
});
