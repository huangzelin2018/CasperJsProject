const util = require("../tool/Util");
var app = require("../config/app");
var fs = require("fs");
// var httpsUtil = require("../tool/HttpsUtil");
// var userDao = require('../dao/UserDao');
var fileUtil = require("../tool/FileUtil");
/**
 * 拉钩简历处理
 */
var lagouService = {
    update_resume: function (casper,obj,detail, html) {//更新简历

        var regx = /itemData\s*=(.*?);\s*var\s*haveInterview/;
        var result = html.match(regx)[1];
        if (!result) {
            var msg = util.format("msg：html内容匹配不到\r\nurl：%s\r\nhtml：%s", data.url, html);
            fileUtil.append(app.logPath(), msg);
            return false;
        }
        var data={};
        var obj = JSON.parse(result);
        data.body = detail;//简历详情
        data.name = obj.candidateName;//姓名
        data.age = 20;//年龄
        data.gender = (obj.sex = '男' ? 1 : 0);//性别
        data.phone = obj.phone;//手机
        data.email = obj.email;//邮箱
        data.school = obj.lastSchoolName;//毕业学校
        data.education = obj.educational;//学历
        data.work = obj.workYear;//工作年限
        data.code='i30ji1tQi7N3Emh1B58Ic07nX5';

        //通过接口获取数据
        var url = app.getResumeApi(data.code);
        casper.start(url, function() {
            console.log(this.getHtml());
        });


    },
}

module.exports = lagouService;