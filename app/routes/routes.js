var Todo = require('../models/todo');
var UrlRepo = require('../models/urlrepo');
var Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var Base = Alphabet.length;

function Encode(i) { 
	if (i==0) 
	{ 
		return Alphabet[0].toString();
	} 
	var s= "";
	while (i > 0)
    {  
		s += Alphabet[i % Base];
        i = Math.round(i / Base);
    }

    return s.split("").reverse().join("");
}

function Decode(s){
    	var i = 0;

    	for (var c=0; c< s.length; c++)
        {
        	i = (i * Base) + Alphabet.indexOf(c);
        }

        return i;
}

function genShortUrl(longurl) {
	if (Decode(Encode(longurl)) != longurl) 
	{
		/*console.log("{0} is not {1}", Encode(longurl), longurl);*/
		return Encode(longurl);
	}
}

var randno = function() {
    return (Math.floor(Math.random() * (100000000 - 0)) + 0);
};

function getUrls(res){
	UrlRepo.find(function(err, urls) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(urls); // return all urls in JSON format
		});
};

function getTodos(res){
	Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
		});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all url's
	app.get('/api/allurls', function(req, res) {

		// use mongoose to get all url's in the database
		getUrls(res);
	});

	// create short url and send back all url's after creation
	app.post('/api/newurl', function(req, res) {
		var _id = randno();

		// create a shorturl, information comes from AJAX request from Angular
		UrlRepo.create({
			id : _id,
			longurl : req.body.text,
			shorturl : genShortUrl(_id),
			location : req.headers
		}, function(err, urls) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			getUrls(res);
		});
	})

	// delete a short url
	app.delete('/api/url/:todo_id', function(req, res) {
		UrlRepo.remove({
			_id : req.params.todo_id
		}, function(err, urls) {
			if (err)
				res.send(err);

			getUrls(res);
		});
	});

	// short url redirection
	app.get('/su/:shorturl', function(req, res) {
		UrlRepo.findOne({shorturl: "diREM"}, function(err, url) {
			res.redirect(url.longurl);
		});
	});


	// get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		getTodos(res);
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			getTodos(res);
		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			getTodos(res);
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};