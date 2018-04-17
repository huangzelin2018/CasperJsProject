/**
 * 抓取拉钩简历详情
 */
var tool = require("./tool/Util");
var util = require('util');
var fileUtil = require("./tool/FileUtil");
var app = require("./config/app");

// var url = "https://easy.lagou.com/can/new/details.htm?u=i30ji1tQi7N3Emh1B58Ic07nX5&userName=huangzelin";
// var number = 'i30ji1tQi7N3Emh1B58Ic07nX5';

var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false, // use these settings
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});


casper.start();

get(app.getLagouApi(),2,function(res){
    console.log(JSON.stringify(res));
});

// casper开始运行
casper.run();

/**
 * 抓取简历
 */
function snatch(number){

    casper.wait(5000, function () {
        var data = '';
        if (this.exists('div.text-layer')) {
            var data = this.getHTML('div.left-content');
            data = tool.filterHtml(data);
        } else if (this.exists('div.online-preview')) {
            var html = this.getHTML('div.online-preview');
            var style = "<style>.mobile{display:block;}.email{display:block;}</style>";
            data = style + html;
        }

        var html = this.getHTML();

        if (!data) {
            var path = app.errorPath(number);
            var logErr = {
                msg: "获取不到数据",
                path: path,
                url: url
            }
            fileUtil.log(JSON.stringify(logErr));
            fileUtil.write(path, html);
            return false;
        }

        var detail = data;
        var regx = /itemData\s*=(.*?);\s*var\s*haveInterview/;
        var result = html.match(regx)[1];
        if (!result) {
            var msg = util.format("msg：html内容匹配不到\r\nurl：%s\r\nhtml：%s", data.url, html);
            fileUtil.append(app.logPath(), msg);
            return false;
        }
        var data = {};
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
        data.code = number;

        //通过接口获取数据
        var url = app.getResumeApi(data.code);
        get(url,1, function (res) {
            //组装对象
            var resumeVo = res.content.data.resumeVo;
            data.area = resumeVo.liveCity;//现居住地
            data.birthday = resumeVo.birthday;//出生年月
            var expectJob = resumeVo.expectJob;
            data.job = expectJob.positionName ? expectJob.positionName : returnObj.content.data.positionName;//应聘岗位
            data.salary = expectJob.salarys;//期望薪资
            data.addrss = expectJob.city;//工作地点或者城市
            // console.log(app.postResumeApi());
            post(app.postResumeApi(),data,function(res){

            });

        });

    });
}



function get(url,type, callback) {
    casper.open(url, {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    }).then(function (response) {
        if (response.status != 200) {
            var msg = util.format("msg：获取不了接口数据\r\nurl：%s",url);
            fileUtil.append(app.logPath(), msg);
            return false;
        }
        var returnObj = JSON.parse(this.getPageContent());
        callback(returnObj);
    });
}

function post(url,data,callback) {
    casper.open(url, {
        method: 'post',
        data: data
    }).then(function(response) {
        if (response.status != 200) {
            var msg = util.format("msg：post数据失败\r\nurl：%s",url);
            fileUtil.append(app.logPath(), msg);
            return false;
        }
        callback(response);
    });
}

