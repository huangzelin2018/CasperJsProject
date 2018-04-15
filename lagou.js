/**
 * 抓取拉钩简历详情
 */
var util = require("./tool/Util");
var fileUtil = require("./tool/FileUtil");
var fs = require("fs");
var app = require("./config/app");
var system = require('system');

var url = system.args[4];
var number = util.getQueryParam(url);

var casper = require('casper').create({
    // clientScripts: ["jquery.js"],
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false, // use these settings
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});

casper.start(url);

casper.wait(5000, function () {
    var data = '';
    if (this.exists('div.text-layer')) {
        var data = this.getHTML('div.left-content');
        data = util.filterHtml(data);
    } else if (this.exists('div.online-preview')) {
        var html = this.getHTML('div.online-preview');
        var style = "<style>.mobile{display:block;}.email{display:block;}</style>";
        data = style + html;
    }

    if (data) {
        fileUtil.write(app.htmlPath(number + "_text"), data);
        fileUtil.write(app.htmlPath(number + "_html"), this.getHTML());
    } else {
        var path = app.errorPath(number);
        var logErr = {
            msg: "获取不到数据",
            path: path,
            url: url
        }
        fileUtil.log(JSON.stringify(logErr));
        fileUtil.write(path, this.getHTML());
        console.error("error");//结束子进程
    }

})

// casper开始运行
casper.run();