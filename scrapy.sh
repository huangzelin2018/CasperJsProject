#!/bin/sh

#set for phantomjs
export PHANTOMJS_HOME=$PATH:/usr/local/phantomjs
export PATH=$PHANTOMJS_HOME/bin:$PATH
/usr/local/casperjs/bin/casperjs /www/web/CasperJS/lagou.js
time=`date +%Y%m%d%H%M%S`
echo "$time is ok"
