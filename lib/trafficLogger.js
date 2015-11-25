'use strict';

var async = require('async'),
    config = require('config'),
    developer = require('../config/developer'),
    request = require('request'),
    mongoose = require('mongoose'),
    ms = require('milliseconds');

var recordSchema = mongoose.Schema({
  time: {type: Date, default: Date.now},
  data: {type: Array, default: []}
});
var Record = mongoose.model('Record', recordSchema);
var db;

var duration = ms.seconds(10),
    baseUrl = config.mapsApi.baseUrl
          + '?traffic_mode=' + config.mapsApi.trafficMode
          + '&departure_time=' + config.mapsApi.departureTime
          + '&key=' + developer.key;

var log = function(err, results) {
  // console.log(results.join());
  var record = new Record({data: results});
  record.save(function(err, record) {
    if (err) {
      console.log(err)
    } else {
      console.log(record.data);
    }
  })
}

var call = function(point, next) {
  var url = baseUrl
            + '&origins=' + point[1]
            + '&destinations=' + point[2];

  request({
      url: url,
      json: true,
  }, function(err, response, body) {
    var result;

    if (err || response.statusCode !== 200) {
      result = -1;
    } else {
      result = body.rows[0].elements[0].duration_in_traffic.value;
    }

    next(null, result);
  });
}

var run = function() {
  async.map(config.points, call, log);
  setTimeout(run, duration);
}

module.exports = {
  start: function() {
    mongoose.connect('mongodb://127.0.0.1/trafficgod');
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(callback) {
      console.log('Connected to mongodb');
      setTimeout(run, 0);
    });

    var places = [];
    for (var i in config.points) {
      places.push(config.points[i][0]);
    }
    console.log(places.join());
  }
}
