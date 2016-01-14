var mongoose = require('mongoose');
var BaseModel = require("./BaseModel");

var PostSchema = new mongoose.Schema({
	author_id: {type: String},
	content: String,
	important: {type:Boolean,default: false},
	create_at: {type:Date, default : Date.now},
	photos: {type:[String]}
	// likes: Array,
	// replycount: Number,
});

PostSchema.plugin(BaseModel);
module.exports = mongoose.model('Post', PostSchema);
