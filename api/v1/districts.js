var DistrictProxy = require('../../proxy/district');
var _ = require('lodash');

module.exports.getDistricts = function (req, res, next) {
	//console.log('getDistricts');
	DistrictProxy.getDistricts(function (err, districts) {
		if (err) {
			return next(err);
		} else {
			districts = districts.map(function (district) {
		        district = _.pick(district, ['_id','name']);
		        return district;
		    })
			res.status(200).json(districts);
		}
	});
};

module.exports.getTowns = function (req, res, next) {
	var district = req.query.district;
	DistrictProxy.getTowns(district, function (err, towns) {
		if (err) {
			return next(err);
		} else {
			res.status(200).json(towns);
		}
	});
};

