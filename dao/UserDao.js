var dbUtil = require('../tool/DbUtil');
var app = require("../config/app");
var fileUtil = require("../tool/FileUtil");

var userDao = {
    updateDetail: function (rows) {

        var modSql = 'UPDATE user SET detail = ? WHERE Id = ?';
        var modSqlParams = [rows.detail, rows.id];
        dbUtil.update(modSql, modSqlParams, function (result) {
            //fs.remove(path)
        });
    }
};


module.exports = userDao;