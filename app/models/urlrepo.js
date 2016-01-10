var mongoose = require('mongoose');

module.exports = mongoose.model('UrlRepo', {
	id : {type : Number, default: ''},
	longurl : {type : String, default: ''},
	shorturl : {type : String, default: ''},
	location : {type : Object, default: ''}
});