var fs = require("../tool/FileUtil");
var https = require("../tool/HttpsUtil");
var app = require("../config/app");

var url = "https://easy.lagou.com/can/share/order.json?code=5AnQ7cI3E7hm1N0LX1K0tj3zvx";
var code='5AnQ7cI3E7hm1N0LX1K0tj3zvx';
https.get(url, function (res) {

    xx(code,function (data) {
        if (data) {
            var resumeVo = res.content.data.resumeVo;
            data.area = resumeVo.liveCity;//现居住地
            data.birthday = resumeVo.birthday;//出生年月
            var expectJob = resumeVo.expectJob;
            data.job = expectJob.positionName;//应聘岗位
            data.salary = expectJob.salarys;//期望薪资
            data.addrss = expectJob.city;//工作地点或者城市
            console.log(data);
        }
    })
});

function xx(code,callback) {


    fs.read(app.htmlPath(code), function (res) {

        console.log(res);

        var data = {};
        var regx = /itemData\s*=(.*?);\s*var\s*haveInterview/;
        var result = res.match(regx)[1];
        if (result) {
            var obj = JSON.parse(result);
            // console.log(obj);
            data.name = obj.candidateName;//姓名
            data.age = 20;//年龄
            data.gender = (obj.sex = '男' ? 1 : 0);//性别
            data.phone = obj.phone;//手机
            data.email = obj.email;//邮箱
            data.school = obj.lastSchoolName;//毕业学校
            data.education = obj.educational;//学历
            data.work = obj.workYear;//工作年限
            // console.log(obj.candidateName);
        }
        callback(data);

    });
}

// var s = "11111111,2222";
// var result = regx.test(s);