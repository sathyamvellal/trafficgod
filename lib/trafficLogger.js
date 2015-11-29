'use strict';

var async = require('async'),
    config = require('config'),
    developer = require('../config/developer'),
    request = require('request'),
    ms = require('milliseconds'),
    argv = require('optimist').argv;

var db = require('./database').getDatabase(),
    record = require('../model/record');

var duration = ms.minutes(5),
    baseUrl = config.mapsApi.baseUrl
          + '?traffic_mode=' + config.mapsApi.trafficMode
          + '&departure_time=' + config.mapsApi.departureTime
          + '&key=' + developer.key;

var log = function(err, data) {
  // console.log(results.join());
  record.create(new Date(), data)
  .then(function(result) {
    // console.log(result.time.getHours()
    //             + ':' + result.time.getMinutes()
    //             + ':' + result.time.getSeconds()
    //             + '\t' + result.data.join(' '));
  }, function(err) {
    // we are gathering data, if there's an error, we omit it.
  });
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
    var places = [];

    for (var i in config.points) {
      places.push(config.points[i][0]);
    }

    console.log(places.join());
    if (argv.notracking || argv.n) {
      console.log('No tracking set!');
    } else {
      setTimeout(run, 0);
    }
  }
}
