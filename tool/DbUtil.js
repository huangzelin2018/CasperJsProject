const mysql = require("mysql");
var cfg = require("../config/db");
var pool = mysql.createPool(cfg);

const dbUtil = {
    /**
     * 导出查询相关
     * @param sql
     * @param callback
     */
    query: function (sql, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(null);
            } else {
                conn.query(sql, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(vals);
                });
            }
        });
    },
    update: function (sql, sqlParams, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(null);
            } else {
                conn.query(sql, sqlParams, function (err, result) {
                    if (err) {
                        console.log('[ERROR] - ', err.message);
                        return;
                    }
                    if (callback) {
                        callback(result);
                    }
                });
            }
        });
    }
};

module.exports = dbUtil;
