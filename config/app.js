var date = require('../tool/DateUtil');
var util = require('util');
var constant = require('../config/constant');
var cfg = {
    htmlPath: function (code) {
        return util.format(constant.HTML_PATH, code);
    },
    logPath: function () {
        return util.format(constant.LOG_PATH, date.getDate('yyyy-MM-dd'));
    },
    errorPath: function (code) {
        return util.format(constant.ERROR_HTML_PATH, code);
    },
    getResumeApi: function (code) {
        return util.format(constant.RESUME_API, code);
    },
}

module.exports = cfg;