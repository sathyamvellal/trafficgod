var express = require('express'),
    router = express.Router(),
    config = require('config'),
    db = require('../lib/database').getDatabase(),
    record = require('../model/record');

/* GET home page. */
router.get('/records', function(req, res, next) {
    record.getAllRecords()
    .then(function(results) {
        var timeKey = req.query.timekey;
        var dataKey = req.query.datakey;

        var records = {};
        for (var i in config.points) {
            records[config.points[i][0]] = [];
        }

        for (var i in results) {
            for (var j in config.points) {
                var record = {}
                record[timeKey] = results[i].time.getTime();
                record[dataKey] = results[i].data[j];
                records[config.points[j][0]].push(record);
            }
        }
        res.json({status: 'OK', records: records});
    }, function(err) {
        res.json({status: 'ERR', err: err});
    });
});

module.exports = router;
