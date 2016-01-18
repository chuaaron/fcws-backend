var mongoose = require('mongoose');

var DistrictSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
	},
	towns: [],
});

module.exports = mongoose.model('District', DistrictSchema);