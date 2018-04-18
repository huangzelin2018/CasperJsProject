/**
 * 抓取拉钩简历详情
 */
var tool = require("../tool/Util");
var util = require('util');
var fileUtil = require("../tool/FileUtil");
var app = require("../config/app");



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

var index = 0;
var list=[{"id":"531","time":"1521858306","source":"188","status":"0","email_id":"1","company_id":"20","user_email":"1677972860@qq.com","brand_id":"1","staff_id":"1240","display":"1","is_active":"1","now_month":"201804","shou_status":"0","extend_id":"16","code":"7IByN1tof51m0nhz3KQE0Ncj1U","url":"https:\/\/easy.lagou.com\/can\/new\/details.htm?u=7IByN1tof51m0nhz3KQE0Ncj1U&userName=huangzelin"}];
list.push(list)

snatchResume(list[index]);


// casper开始运行
casper.run();

/**
 * 抓取简历
 */
function snatchResume(vo) {
    casper.open(vo.url);
    casper.wait(20000, function () {
        step1(vo,this);
    });
}

/**
 * 获取简历详情
 */
function step1(vo,casperObj) {
    var data = '';
    if (casperObj.exists('div.text-layer')) {
        if(casperObj.getHTML('div.text-layer')){
            var html = casperObj.getHTML('div.left-content');
            data = tool.filterHtml(html);
        }else{
            data = casperObj.getHTML('div.graph-layer');
        }
    } else if (casperObj.exists('div.online-preview')) {
        var html = casperObj.getHTML('div.online-preview');
        var style = "<style>.mobile{display:block;}.email{display:block;}</style>";
        data = style + html;
    }

    if (data) {
        return step2(vo,casperObj,data);
    }
    var pageHtml = casperObj.getHTML();
    var path = app.errorPath(vo.code);
    var logErr = {
        msg: "获取不到数据,查看是否规则变了？",
        path: path,
        url: vo.url
    }
    fileUtil.log(JSON.stringify(logErr));
    fileUtil.write(path, pageHtml);
    return false;
}

/**
 * 清洗数据
 */
function step2(vo,casperObj,detaliInfo) {
    var pageHtml = casperObj.getHTML();
    //匹配页面内容的数据
    var regx = /itemData\s*=(.*?);\s*var\s*haveInterview/;
    var result = pageHtml.match(regx)[1];
    if (!result) {
        var msg = util.format("msg：html内容匹配不到\r\nurl：%s\r\nhtml：%s", vo.url, pageHtml);
        fileUtil.append(app.logPath(), msg);
        return false;
    }
    var obj = JSON.parse(result);
    vo.title = casperObj.getTitle();//简历标题
    vo.body = detaliInfo;//简历详情
    vo.name = obj.candidateName;//姓名
    vo.age = obj.ageNum ? obj.ageNum : 20;//年龄
    vo.gender = (obj.sex = '男' ? 1 : 0);//性别
    vo.phone = obj.phone;//手机
    vo.email = obj.email;//邮箱
    vo.school = obj.lastSchoolName;//毕业学校
    vo.education = obj.educational;//学历
    vo.work = obj.workYear;//工作年限
    step3(vo);
}

function step3(vo) {

    //通过接口获取数据
    var url = app.getResumeApi(vo.code);
    get(url, function (res) {
        //组装对象
        var resumeVo = res.content.data.resumeVo;
        vo.area = resumeVo.liveCity;//现居住地
        vo.birthday = resumeVo.birthday;//出生年月
        var expectJob = resumeVo.expectJob;
        vo.job = expectJob.positionName ? expectJob.positionName : res.content.data.positionName;//应聘岗位
        vo.salary = expectJob.salarys;//期望薪资
        vo.addrss = expectJob.city;//工作地点或者城市
        // console.log(JSON.stringify(data));
        fileUtil.append(app.logPath(), JSON.stringify(vo)+"\r\n");
        // post(app.postResumeApi(), data);
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

