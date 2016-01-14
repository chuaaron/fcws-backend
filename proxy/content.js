var ContentModel = require('../models/Content.js');
var eventproxy = require('eventproxy');

//return _id and title only
module.exports.getContents = function (query, callback) {
    ContentModel.find(query, null, {sort: {create_at: -1}}, function (err, contents) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, contents);
        }
    });
};

//return all items
module.exports.getContentsById = function (_id, callback) {
    ContentModel.findOne({_id: _id}, function (err, content) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, content);
        }
    });
};

// create_at  is  saved  as  default
module.exports.newAndSave = function(title, category, sub_category, details, callback){
    var content = new ContentModel();
    content.title = title;
    content.category = category;
    content.sub_category = sub_category;
    content.details = details;

    content.save(callback);
};

module.exports.deleteContentsById = function (_id, callback) {
    ContentModel.findByIdAndRemove(_id, function (err, content) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, content);
        }
    });
};

// do not update create_at
module.exports.updateContentsById = function (id, title, category, sub_category, details, callback) {
    var content = {};
    content.title = title;
    content.category = category;
    content.sub_category = sub_category;
    content.details = details;

    ContentModel.findByIdAndUpdate(id, content, function (err, content) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, content);
        }
    });
};
