// app/models/auth.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our auth model
var authSchema = mongoose.Schema({
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// checking if password is valid using bcrypt
authSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// this method hashes the password and sets the auths password
authSchema.methods.hashPassword = function(password) {
    var auth = this;

    // hash the password
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err)
            return next(err);

        auth.local.password = hash;
    });

};

// create the model for auths and expose it to our app
module.exports = mongoose.model('Auth', authSchema);