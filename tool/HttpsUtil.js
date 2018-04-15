var https = require('https');
var iconv = require("iconv-lite");
var httpsUtil = {
    get: function (url, callback) {
        https.get(url, function (res) {
            var datas = [];
            var size = 0;
            res.on('data', function (data) {
                datas.push(data);
                size += data.length;
            });
            res.on("end", function () {
                var buff = Buffer.concat(datas, size);
                var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring
                callback({success: true, msg: 'ok', data: result});
            });
        }).on('error', function (err) {
            console.log('获取异常：' + JSON.stringify(err));
            callback({success: false, msg: err});
        })
    }
};

module.exports = httpsUtil;