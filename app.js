/**
 * 抓取拉钩简历主线程
 */
const userDao = require('./dao/UserDao');
const dbUtil = require('./tool/DbUtil');
const fileUtil = require("./tool/FileUtil");
const app = require("./config/app");

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
        } else {
            userDao.updateDetail(rows);
        }
        process.exit(0);
    });
    // ls.stdout.on('data', function (data) {
    //     console.log('stdout: ' + data);
    // });
}

