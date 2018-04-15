
const util = require("util");

var constant = {
    HTML_PATH: "html/%s.html",
    LOG_PATH: "log/error_%s.log",
    ERROR_HTML_PATH: "log/html/%s.html",
    RESUME_API: "https://easy.lagou.com/can/share/order.json?code=%s",//拉钩简历信息api
}

module.exports = constant;