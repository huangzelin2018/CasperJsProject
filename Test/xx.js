

var page = require('webpage').create(),
    server = 'https://easy.lagou.com/can/share/order.json?code=i30ji1tQi7N3Emh1B58Ic07nX5';

page.open(server, 'get', function (status) {
    console.log(status);
    if (status !== 'success') {
        console.log('Unable to post!');
    } else {
        console.log(page.content);
    }
    phantom.exit();
});