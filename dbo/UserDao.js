var dbUtil = require('../tool/DbUtil');
const app = require("../config/app");
const fileUtil = require("../tool/FileUtil");

var userDao = {
    updateDetail: function (rows) {
        var path = app.htmlPath(rows.code);
        fileUtil.read(path, function (data) {
            rows.detail = data.toString();
            var modSql = 'UPDATE user SET detail = ? WHERE Id = ?';
            var modSqlParams = [rows.detail, rows.id];
            dbUtil.update(modSql, modSqlParams, function (result) {
                //fs.remove(path)
            });

        });
    }
};


module.exports = userDao;