// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'googleAuth' : {
        'clientID'      : 'your google app clientID',
        'clientSecret'  : 'your google app clientSecret',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};