var jwt = require('jwt-simple');
var tokenSecret = 'fcwssecret';

var moment = require('moment');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
module.exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }
};

module.exports.encode = function(data) {
    return jwt.encode(data, tokenSecret);
};

module.exports.decode = function(data) {
    return jwt.decode(data, tokenSecret);
};
