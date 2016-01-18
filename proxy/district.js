var DistrictModel = require('../models/District.js');
var UserModel = require('../models/User.js');
var eventproxy = require('eventproxy');

module.exports.getDistricts = function (callback) {
	DistrictModel.find({}, function (err, districts) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, districts);
		}
	});
};

module.exports.getTowns = function (district_name, callback) {
	DistrictModel.findOne({name: district_name}, function (err, district) {
		if (err || !district) {
			return callback(err);
		} else {
			return callback(null, district.towns);
		}
	});
};

//create a new district, parameter name is the name of the created district
//module.exports.newDistrict = function (name, callback) {
//	var district = new DistrictModel();
//	district.name = name;
//	district.towns = [];
//
//	district.save(callback);
//};

//module.exports.deleteDistrictById = function (_id, callback) {
//	DistrictModel.findOneAndRemove({_id: _id, towns: []}, function (err, district) {
//		if (err) {
//			return callback(err);
//		} else {
//			return callback(null, district);
//		}
//	});
//};
//
//module.exports.updateDistrictById = function (_id, newName, callback) {
//	var ep = new eventproxy();
//	DistrictModel.findByIdAndUpdate(_id, {name: newName}, function (err, district) {
//		if (err) {
//			return callback(err);
//		} else {
//			ep.emit("updateDistrict", district);
//		}
//	});
//	ep.on("updateDistrict", function (district) {
//		UserModel.update({district: district.name}, {district: newName}, {multi: true}, function (err) {
//			if (err) {
//				return callback(err);
//			} else {
//				return callback(null, district);
//			}
//		});
//	});
//};

//create a new town, parameter name is the name of the created town
module.exports.newTown = function (district_name, town_name, callback) {
	DistrictModel.findOneAndUpdate({name:district_name}, {$addToSet: {towns: town_name}}, function (err, district) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, district);
		}
	});
};

//use callback(err, message);
module.exports.deleteTown = function (district_name, town_name, callback) {
	var ep = new eventproxy();

	UserModel.find({district: district_name, town: town_name}, function (err, contacts) {
		if(err) {
			return callback(err,null);
		} else if (contacts.length != 0) {
			var error = {};
			error.message = "该子区域存在用户,无法删除";
			return callback(error, null);
		} else {
			ep.emit("deleteTown");
		}
	});

	ep.on("deleteTown", function () {
		DistrictModel.findOneAndUpdate({name:district_name}, {$pull: {towns: town_name}}, function (err, district) {
			if (err) {
				return callback(err);
			} else {
				return callback(null,{} );
			}
		});
	});
};

module.exports.updateTown = function (district_name, old_town_name, new_town_name, callback) {
	var ep = new eventproxy;
	DistrictModel.findOne({name:district_name}, function (err, district) {
		if (err) {
			return callback(err);
		} else if(!district){
            var error = {};
            error.message = "区域不存在";
            return callback(error);
        } else {
            console.log(district);
			var index = district.towns.indexOf(old_town_name);
			district.towns.set(index,new_town_name);
            console.log(district.towns)
			district.save(function (err, district) {
				if (err) {
					return callback(err);
				} else {
                    console.log(district);
					ep.emit("updateTown", district);
				}
			});
		}
	});
	ep.on("updateTown", function (district) {
		UserModel.update({district: district.name, town: old_town_name}, {town: new_town_name}, {multi: true}, function (err) {
			if (err) {
				return callback(err);
			} else {
				return callback(null, district);
			}
		});
	});
};

