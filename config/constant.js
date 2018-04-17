
const util = require("util");

var host='http://zhilian.email.com/index.php/Home/ResumeApi';
var constant = {
    HTML_PATH: "html/%s.html",
    LOG_PATH: "log/error_%s.log",
    ERROR_HTML_PATH: "log/html/%s.html",
    GET_RESUME_API: "https://easy.lagou.com/can/share/order.json?code=%s",//拉钩简历信息api
    LAGOU_RESUME_API:{
        GET_API:host+"/get_lagou_api",//获取拉钩简历
        POST_API:host+ "/post_lagou_api",//保存简历信息api
    }
};

module.exports = constant;