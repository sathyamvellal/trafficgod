'use strict';

var mongoose = require('mongoose'),
    Q = require('q');

var recordSchema = mongoose.Schema({
  time: {type: Date, default: Date.now},
  data: {type: Array, default: []}
});

var Record = mongoose.model('Record', recordSchema);

module.exports = {
    create: function(time, data) {
        var deferred = Q.defer();
        var record = new Record({data: data});
        record.save(function(err, results) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(results);
            }
        });
        return deferred.promise;
    },

    getAllRecords: function(data) {
        var deferred = Q.defer();
        Record.find({}, function(err, results) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(results);
            }
        });
        return deferred.promise;
    }
};