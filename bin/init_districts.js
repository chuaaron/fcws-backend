var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/fcws_expr');

var User = require('../models/User.js');
var District = require('../models/District.js');

var ep = new eventproxy();

District.remove(function (err) {
	if (err) {
		console.log(err);
	} else {
		ep.emit('removed');
	}
});

ep.on('removed', function () {
	User.find().distinct('district', function (err, districts) {
		if (err) {
			console.log(err);
		} else {
			districts.splice(districts.indexOf(''), 1);
			ep.emit('districts', districts)
		}
	});
});

ep.on('districts', function (districts) {
	for (var i = 0; i < districts.length; i++) {
		ep.on('towns' + i, (function (i) {
			return function () {
				User.find({district: districts[i]}).distinct('town', function (err, towns) {
					if (err) {
						console.log(err);
					} else {
						var district = new District();
						district.name = districts[i];
						towns.splice(towns.indexOf(''), 1);
						district.towns = towns;
						district.save(function (err, district) {
							if (err) {
								console.log(err);
							} else {
								ep.emit('createDistrict', district);
							}
						});
						ep.emit('towns' + (i + 1));
					}
				});
			}
		})(i));
	}
	ep.emit('towns' + 0);
	ep.after('createDistrict', districts.length, function (districts) {
		console.log(districts);
		mongoose.connection.close();
	})
});



// District.find({}, function (err, districts) {
// 	if (err) {
// 		return next(err);
// 	} else {
// 		var districtNames = [];
// 		for (var i = 0; i < districts.length; i++)
// 			districtNames.push(districts[i].name);
// 		console.log(districtNames);
// 		mongoose.connection.close();
// 	}
// });

// District.findOne({name: '高港区'}, function (err, district) {
// 	if (err) {
// 		return next(err);
// 	} else {
// 		console.log(district.towns);
// 		mongoose.connection.close();
// 	}
// });

// District.findOneAndUpdate({name: '高港区'}, {$pull: {towns: 'dadada'}}, function (err, district) {
// 	if (err) {
// 		return next(err);
// 	} else {
// 		console.log(district.towns);
// 		mongoose.connection.close();
// 	}
// });
