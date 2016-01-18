var mongoose = require('mongoose');
var BaseModel = require("./BaseModel");

var ContentSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: 'title is required',
	},
	create_at: {
		type:Date,
		default : Date.now,
	},
	category: {
		type: String,
		enum: ['train', 'education', 'defence'],
	},
	sub_category: {
		type: String,
		//enum: [],
	},
	details: String
});

ContentSchema.plugin(BaseModel);
module.exports = mongoose.model('Content', ContentSchema);