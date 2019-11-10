var express = require('express');
var handlebars = require('express-handlebars');
var app = express();

app.disable('x-powered-by');
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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
