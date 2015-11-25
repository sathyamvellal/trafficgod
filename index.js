'use strict';

var http = require('http');

var direction = process.env['DIRECTION'];
var shouldRun = true;

switch (direction) {
    case 'north':
        require('./north').run();
    break;
    case 'south':
        require('./south').run();
    break;
    default:
        console.log('Specify a direction!');
        shouldRun = false;
}

if (shouldRun) {
    http.createServer().listen(9999);
}
