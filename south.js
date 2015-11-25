'use strict';

var request = require('request');

var baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
var places = ['krpuram', 'soulspace', 'marathalli', 'ecospace', 'silkboard'];
var origins = ['12.998571,77.672631', '12.981649,77.693601', '12.960177,77.701430', '12.928993,77.683082', '12.917039,77.627538'];
var destinations = ['12.997864,77.682840', '12.977383,77.696182', '12.953160,77.700202', '12.924343,77.673329', '12.916410,77.620127'];

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
