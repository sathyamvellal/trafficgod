'use strict';

var config = require('config'),
    mongoose = require('mongoose');

var url = 'mongodb://' + config.mongodb.host + '/' + config.mongodb.database;
var db;

mongoose.connect(url);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    // connection is now open!
});

module.exports = {
    getDatabase: function() {
        return db;
    }
}
