var util = {
    filterHtml: function (html) {//过滤html标签
        //过滤html注释
        html = html.replace(/<!--.*?-->/g, "");

        //过滤html标签
        var regx = /<[^>]*>|<\/[^>]*>/gm;
        return html.replace(regx, "");
    },
    filterImgTag:function(html){
        //过滤img标签
        var reTag = /<img(?:.|\s)*?>/g;
        return html.replace(reTag,'')
    },
    getQueryParam: function (url) {
        var result = url.match(new RegExp("[\?\&]u=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    }
};

module.exports = util;