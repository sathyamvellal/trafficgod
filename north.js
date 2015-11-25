'use strict';

var request = require('request');

var baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
var places = ['silkboard', 'ecospace', 'marathalli', 'soulspace', 'krpuram'];
var origins = ['12.916562,77.620190', '12.924316,77.672815', '12.953273,77.700117', '12.977299,77.696000', '12.997640,77.682808'];
var destinations = ['12.917571,77.626268', '12.929149,77.682981', '12.960185,77.701299', '12.981528,77.693486', '12.998344,77.672778'];

var url = baseUrl + '?origins=' + origins.join('|') + '&destinations=' + destinations.join('|') + '&key=' + key;

var DURATION = 1000 * 60 * 10; // 10 minutes

var log = function(response) {
    var durations = [];
    for (var i in response.rows) {
        durations.push(response.rows[i].elements[i].duration.value);
    }
    console.log(durations.toString());
}

var call = function() {

    request({
        url: url,
        json: true,
    }, function(err, response, body) {
        if (err) {
            throw err;
            return;
        }

        if (response.statusCode === 200) {
            log(body);
        }
    });

    setTimeout(call, DURATION);
}

module.exports = {
    run: function() {
        console.log(places.join(','));
        setTimeout(call, 0);
    }
}
