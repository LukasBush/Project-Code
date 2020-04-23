var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var pgp = require('pg-promise')();

const dbConfig = {
	host: 'localhost',
	port: '5432',
	database: 'webpage_comments',
	user: 'postgres',
	password: 'Magoocool1998!'
}

var db = pgp(dbConfig);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
	res.render('pages/home',{
	});
});

app.get('/WTW', function(req, res) {
	var location = req.body.myInput;
	var comments = "SELECT * FROM comments WHERE location = '" + location +"';";
	//var query = 'SELECT * FROM comments;';
	db.any(comments)
	.then(function (rows){
			res.render('pages/WTW',{
				data: rows
			})
		})
		.catch(function (err) {
			console.log('error', err);
			response.render('pages/WTW', {
			})
		});
});

/*app.get('/WTW/comments', function(req, res){
	//var location = req.query.
	//var comments = "SELECT * FROM comments WHERE location = '" + location +"';";
	var query = 'SELECT * FROM comments;';
	db.any(query)
	.then(function (rows){
			res.render('pages/WTW',{
				data: rows
			})
		})
		.catch(function (err) {
			console.log('error', err);
			response.render('pages/WTW', {
			})
		});
});*/

app.get('/comments', function(req, res) {
	res.render('pages/comment',{
	});
});


app.post('/comments/post_comment', function(req, res) {
	var place = req.body.location;
	var	weather = req.body.descript;
	var fName = req.body.firstName;
	var lName = req.body.lastName;
	var thought = req.body.comment;

	var insert_statement = "INSERT INTO comments VALUES ('" + fName + "','" + lName + "','" + place + "','" + weather + "','" + thought + "') ON CONFLICT DO NOTHING;";

	db.task('post-everything', task => {
		return task.batch([
			task.any(insert_statement)
		]);
	})
	.then(info => {
		res.render('pages/comment', {
		})
	})
	.catch(err => {
		console.log('error', err);
		response.render('comments')
	});
});

app.listen(3000);
console.log('3000 is the magic port');