/**
 * 抓取拉钩简历详情
 */
var tool = require("./tool/Util");
var util = require('util');
var fileUtil = require("./tool/FileUtil");
var app = require("./config/app");

var index = 0
var aList = [];
aList.push({
    code: 'i30ji1tQi7N3Emh1B58Ic07nX5',
    'url': "https://easy.lagou.com/can/new/details.htm?u=i30ji1tQi7N3Emh1B58Ic07nX5&userName=huangzelin"
});
aList.push({
    code: '37Q14j0n40EI6dhtLK35lm1GNR8',
    'url': "https://easy.lagou.com/can/new/details.htm?u=37Q14j0n40EI6dhtLK35lm1GNR8&userName=huangzelin"
});
aList.push({
    code: 'Q33ND77Ejc5m3t1A7nhI010ikE',
    'url': "https://easy.lagou.com/can/new/details.htm?u=Q33ND77Ejc5m3t1A7nhI010ikE&userName=huangzelin"
});
aList.push({
    code: '5AnQ7cI3E7hm1N0LX1K0tj3zvx',
    'url': "https://easy.lagou.com/can/new/details.htm?u=5AnQ7cI3E7hm1N0LX1K0tj3zvx&userName=huangzelin"
});


var casper = require('casper').create({
    verbose: true,
    logLevel: 'info',
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false, // use these settings
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});


casper.start();

casper.repeat(aList.length, function () {
    var data = aList[index];
    snatch(data.url, data.code);
    index++;
});

// get(app.getLagouApi(), function (res) {
//     var list = res.data;
//     if (res.status != 200 || list.length == 0) {
//         return false;
//     }
//     // casper.repeat(list.length, function () {
//     //     var data = list[index];
//     //     snatch(data.url, data.code);
//     //     index++;
//     // });
//
// });


// casper开始运行
casper.run();

/**
 * 抓取简历
 */
function snatch(url, number) {
    casper.open(url);
    casper.wait(3000, function () {
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
        data.title = this.getTitle();//简历标题
        data.body = detail;//简历详情
        data.name = obj.candidateName;//姓名
        data.age = obj.ageNum ? obj.ageNum : 20;//年龄
        data.gender = (obj.sex = '男' ? 1 : 0);//性别
        data.phone = obj.phone;//手机
        data.email = obj.email;//邮箱
        data.school = obj.lastSchoolName;//毕业学校
        data.education = obj.educational;//学历
        data.work = obj.workYear;//工作年限
        data.code = number;

        //通过接口获取数据
        var url = app.getResumeApi(data.code);
        get(url, function (res) {
            //组装对象
            var resumeVo = res.content.data.resumeVo;
            data.area = resumeVo.liveCity;//现居住地
            data.birthday = resumeVo.birthday;//出生年月
            var expectJob = resumeVo.expectJob;
            data.job = expectJob.positionName ? expectJob.positionName : res.content.data.positionName;//应聘岗位
            data.salary = expectJob.salarys;//期望薪资
            data.addrss = expectJob.city;//工作地点或者城市
            // console.log(JSON.stringify(data));
            fileUtil.append(app.logPath(), JSON.stringify(data)+"\r\n");
            // post(app.postResumeApi(), data);
        });
    });
}


function get(url, callback) {
    casper.open(url, {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    }).then(function (response) {
        if (response.status != 200) {
            var msg = util.format("msg：获取不了接口数据\r\nurl：%s\r\n", url);
            fileUtil.append(app.logPath(), msg);
            return false;
        }
        // var html = tool.replaceJson(this.getPageContent());
        var returnObj = JSON.parse(this.getPageContent());
        callback(returnObj);
    });
}

function post(url, data, callback) {
    casper.open(url, {
        method: 'post',
        data: data
    }).then(function (response) {
        if (response.status != 200) {
            var msg = util.format("msg：post数据失败\r\nurl：%s", url);
            fileUtil.append(app.logPath(), msg);
            return false;
        }
        if (callback) {
            callback(response);
        }
    });
}

