/**
 * 抓取拉钩简历
 */
var lagouService = require('./service/LagouService');
var dbUtil = require('./tool/DbUtil');
var fileUtil = require("./tool/FileUtil");
var app = require("./config/app");
var fs = require("fs");

var sql = "select * from user ";
dbUtil.query(sql, function (rows) {
    for (var i = 0; i < rows.length; i++) {
        capture(rows[i]);
    }
});


function capture(rows) {
    var spawn = require('child_process').spawn;
    var ls = spawn('casperjs', ['lagou.js', rows.url]);
    ls.on('close', function (code) {
        if (code == 1) {
            var msg = '没有获取到数据。目标：' + rows.url;
            fileUtil.append(app.logPath(), msg);
            // child_process.kill();
        }


    });
    ls.on('exit', function (code) {
        console.log('子进程已退出，退出码 '+code);
    })
    // ls.stdout.on('data', function (data) {
    //     console.log(data.toString())
    // });

}
