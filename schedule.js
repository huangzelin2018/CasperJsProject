var schedule = require('node-schedule');
var fs = require("fs");
var date = require('./tool/DateUtil');
var fileUtil = require("./tool/FileUtil");
var app = require("./config/app");


var j = schedule.scheduleJob('*/1 * * * *', function () {

    test();

});

function test() {
    var msg = 'The answer to life, the universe, and everything!\r\n';
    var time = '[ ' + date.getDate('yyyy-MM-dd hh:mm:ss') + ' ] ' + '\r\n';
    console.log((time + msg));
    fileUtil.append(app.logPath(), (time + msg));
}