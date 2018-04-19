/**
 * 抓取拉钩简历详情
 */
var tool = require("./tool/Util");
var util = require('util');
var fileUtil = require("./tool/FileUtil");
var app = require("./config/app");
var index = 0;

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


get(app.getLagouApi(), function (res) {
    var list = res.data;
    if (res.status != 200 || list.length == 0) {
        return false;
    }
    casper.repeat(list.length, function () {
        snatchResume(list[index]);
        index++;
    });

});


// casper开始运行
casper.run();

/**
 * 抓取简历
 */
function snatchResume(vo) {
    casper.open(vo.url);
    casper.wait(5000, function () {
        step1(vo, this);
    });
}

/**
 * 获取简历详情
 * 直接通过拉钩接口拿简历
 */
function step1(vo, casperObj) {

    var data = '';
    if (casperObj.exists('div.text-layer')) {
        var html = casperObj.getHTML('div.left-content');
        data = tool.filterHtml(html);
    } else if (casperObj.exists('div.online-preview')) {
        var html = casperObj.getHTML('div.online-preview');
        var style = "<style>.mobile{display:block;}.email{display:block;}</style>";
        data = style + tool.filterImgTag(html);
    } else {
        data = util.format("<img src='https://easy.lagou.com/can/share/image/%s/page_image_0.pnga' style='width:780px;'>", vo.code);
        var pageHtml = casperObj.getHTML();
        var path = app.errorPath(vo.code);
        var logErr = {
            msg: "获取不到数据,查看是否规则变了？",
            path: path,
            url: vo.url
        }
        fileUtil.log(JSON.stringify(logErr));
        fileUtil.write(path, pageHtml);
    }

    step2(vo, casperObj, data);

}

/**
 * 清洗数据
 */
function step2(vo, casperObj, detaliInfo) {
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

/**
 * 通过接口获取数据
 * @param vo
 */
function step3(vo) {
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
        //删除不必要属性
        var keys = ["url", "code"];
        keys.forEach(function (item) {
            delete vo[item]
        });
        post(app.postResumeApi(), vo);
    });
}

var option = {
    // host: 'ip',
    // port: 'ports',
    method: 'GET',
    timeout: 10000,
    headers: {
        'scheme': 'https',
        'version': 'HTTP/1.1',
        'Accept': 'application/json',
        'Accept-Encoding': 'deflate, sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Cache-Control': 'no-cache',
        'connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36'
    }
}

function get(url, callback) {
    casper.open(url, option).then(function (response) {
        if (response.status != 200) {
            var msg = util.format("msg：获取不了接口数据\r\nurl：%s\r\n", url);
            fileUtil.append(app.logPath(), msg);
            return false;
        }
        try {
            var returnObj = JSON.parse(this.getPageContent());
            callback(returnObj);
        } catch (err) {

        }
    });
}

function post(url, data, callback) {
    casper.open(url, {
        method: 'POST',
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
