var Todo = require('../models/todo');
var UrlRepo = require('../models/urlrepo');
var Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var Base = Alphabet.length;

function Encode(i) {
    if (i == 0) {
        return Alphabet[0].toString();
    }
    var s = "";
    while (i > 0) {
        s += Alphabet[i % Base];
        i = Math.round(i / Base);
    }

    return s.split("").reverse().join("");
}

function Decode(s) {
    var i = 0;

    for (var c = 0; c < s.length; c++) {
        i = (i * Base) + Alphabet.indexOf(c);
    }

    return i;
}

function genShortUrl(longurl) {
    if (Decode(Encode(longurl)) != longurl) {
        /*console.log("{0} is not {1}", Encode(longurl), longurl);*/
        return Encode(longurl);
    }
}

var randno = function() {
    return (Math.floor(Math.random() * (100000000 - 0)) + 0);
};

function getUrls(req, res) {
	var query = req.user ? {"email": req.user.google.email} : {};
    UrlRepo.find(query ,function(err, urls) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(urls); // return all urls in JSON format
    });
};

function getTodos(res) {
    Todo.find(function(err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
};

module.exports = function(app, passport) {

    // api ---------------------------------------------------------------------
    // get all url's
    app.get('/api/allurls', function(req, res) {

        // use mongoose to get all url's in the database
        getUrls(req, res);
    });

    // create short url and send back all url's after creation
    app.post('/api/newurl', function(req, res) {
        var _id = randno();

        // create a shorturl, information comes from AJAX request from Angular
        UrlRepo.create({
            id: _id,
            longurl: req.body.text,
            shorturl: req.body.customtext ? req.body.customtext : genShortUrl(_id),
            location: req.headers
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
            _id: req.params.todo_id
        }, function(err, urls) {
            if (err)
                res.send(err);

            getUrls(res);
        });
    });

	// delete a short url
    app.get('/api/isLoggedIn', function(req, res) {
    	res.send(req.user || null);
    });    

    // short url redirection
    app.get('/su/:shorturl', function(req, res) {
        UrlRepo.findOne({
            shorturl: req.params.shorturl
        }, function(err, url) {
            url.clicks = url.clicks + 1;
            url.save(function(err) {
                if (err) {
                    console.error(err);
                }
            });
            res.redirect(url.longurl);
        });
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/index',
            failureRedirect: '/'
        }));

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};