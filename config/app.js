const date = require('../tool/DateUtil');
const util = require('util');
var cfg = {
    htmlPath: function (code) {
        var filePath = "html/" + code + ".html";
        return filePath;
    },
    logPath: function () {
        return util.format('log/error_%s.log', date.getDate('yyyy-MM-dd'));
    }
}

module.exports = cfg;