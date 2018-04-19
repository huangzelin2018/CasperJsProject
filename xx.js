var casper = require('casper').create();

var fs = require("fs");
var date = require('./tool/DateUtil');

var msg='The answer to life, the universe, and everything!\r\n';
var time = '[ ' + date.getDate('yyyy-MM-dd hh:mm:ss') + ' ] ' + '\r\n';
var data=time+msg;
fs.write("./log.txt",data, 'a');

casper.start('http://www.baidu.com/', function() {
    this.echo(this.getTitle());
});

casper.then(function() {
    this.capture('baidu-homepage.png'); //  生成一个png图片
});

casper.run();