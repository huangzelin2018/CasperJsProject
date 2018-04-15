var fs = require('fs');
var date = require('../tool/DateUtil');
var app = require('../config/app');
var fileUtil = {
    remove: function (filePath) {
        fs.unlink(filePath, function (err) {
            if (err) {
                console.error(err);
            }
        });
    },
    read: function (filePath, callback) {
        fs.readFile(filePath, function (err, data) {
            if (err) {
                console.log(err);
                return false;
            }
            callback(data.toString());
        });
    },
    write: function (filePath, data) {
        fs.write(filePath, data, 'w');
    },
    append:function(path,data){
        data=data+ '\r\n';
        fs.appendFile(path,data, function () {
            // console.log('追加内容完成');
        });
    },
    log: function (data) {
        var time = '[ ' + date.getDate('yyyy-MM-dd hh:mm:ss') + ' ] ' + '\r\n';
        var error = time + data + '\r\n';
        fs.write(app.logPath(), error, 'a');
    }
};

module.exports = fileUtil;