var eventproxy = require('eventproxy');

var accesstoken = function (req, res, next) {
  var ep = new eventproxy();
  ep.fail(next);

  res.send({
    success: true,
    id: req.user.id,
  });
};
exports.accesstoken = accesstoken;
