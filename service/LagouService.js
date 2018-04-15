const util = require("../tool/Util");
var app = require("../config/app");
var fs = require("fs");
var httpsUtil = require("../tool/HttpsUtil");
var userDao = require('../dao/UserDao');
var fileUtil = require("../tool/FileUtil");
/**
 * 拉钩简历处理
 */
var lagouService = {
    update_resume: function (data,callback) {//更新简历

        var detail = fs.readFileSync(app.htmlPath(data.code + "_text")).toString();
        var html = fs.readFileSync(app.htmlPath(data.code + "_html")).toString();
        var regx = /itemData\s*=(.*?);\s*var\s*haveInterview/;
        var result = html.match(regx)[1];
        if (!result) {
            var msg = util.format("msg：html内容匹配不到\r\nurl：%s\r\nhtml：%s", data.url, html);
            fileUtil.append(app.logPath(), msg);
            return false;
        }

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

        //通过接口获取数据
        var url = app.getResumeApi(data.code);

        httpsUtil.get(url, function (res) {
            if (!res.success) {
                var msg = util.format("msg：接口获取数据是吧\r\nurl：%s\r\n错误信息：%s", url, JSON.stringify(res.msg));
                fileUtil.append(app.logPath(), msg);
                return false;
            }

            var returnObj = JSON.parse(res.data);

            //组装对象
            var resumeVo = returnObj.content.data.resumeVo;
            data.area = resumeVo.liveCity;//现居住地
            data.birthday = resumeVo.birthday;//出生年月
            var expectJob = resumeVo.expectJob;
            data.job = expectJob.positionName ? expectJob.positionName : returnObj.content.data.positionName;//应聘岗位
            data.salary = expectJob.salarys;//期望薪资
            data.addrss = expectJob.city;//工作地点或者城市

            callback();
            // userDao.updateDetail(data);
        });
    },
}

module.exports = lagouService;