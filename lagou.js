/**
 * 抓取拉钩简历详情
 */
const util = require("./tool/Util");
const fs = require("./tool/FileUtil");
const app = require("./config/app");
const system = require('system');

var url = system.args[4];
var number = util.getQueryParam(url);

var casper = require('casper').create({
    // clientScripts: ["jquery.js"],
    verbose: false,
    // logLevel: 'debug',
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false // use these settings
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
    if (!data) {
        var logErr = {
            msg: 'no data',
            url: url
        }
        fs.log(JSON.stringify(logErr));
        console.error("error");//结束子进程
        return false;
    }
    fs.write(app.htmlPath(number), data);

})

// casper开始运行
casper.run();