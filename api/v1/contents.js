var ContentModel = require('../../models/Content');
var ContentProxy = require('../../proxy/content');
var _ = require('lodash');
var markdown = require('markdown').markdown;
var eventproxy = require('eventproxy');


 module.exports.list = function (req, res, next) {
     var limit = Number(req.query.limit) || 10;
     ContentModel.find().limit(limit).sort({create_at: -1}).exec(function(err,contents){
        if(err) {
            return next(err);
        }else{
            contents = contents.map(function (content) {
                content = _.pick(content, ['_id', 'title','create_at']);
                return content;
            })
            res.status(200).json(contents);
        }
     });
 };

//get contents by _id, req.query = {_id: ...}
module.exports.getContentsById = function (req, res, next) {
    var id = req.params.id;
    ContentProxy.getContentsById(id, function (err, content) {
        if (err) {
            return next(err);
        } else {
            var markdownData =markdown.toHTML(content.details);
            //console.log(markdownData);
            res.status(200).json(markdownData);
        }
    });
};

// get contents by category, req.query = {category: ...}
// module.exports.getContentsByCategory = function (req, res, next) {
//     ContentProxy.getContents(req.query, function (err, contents) {
//         if (err) {
//             return next(err);
//         } else {
//             res.status(200).json(contents);
//         }
//     });
// };

module.exports.getContentsBySubcategory = function (req, res, next) {
    ContentProxy.getContents({category: req.query.category, sub_category: req.query.sub_category}, function (err, contents) {
        if (err) {
            return next(err);
        } else {
            contents = contents.map(function (content) {
                content = _.pick(content, ['_id', 'title']);
                return content;
            })
            res.status(200).json(contents);
        }
    });
};

// create new content, TO BE  moved to ../../controllers/content.js
// module.exports.create = function (req, res, next) {
//     var title = req.body.title;
//     var category = req.body.category; 
//     var sub_category = req.body.sub_category; 
//     var details = req.body.details;

//     ContentProxy.newAndSave(title, category, sub_category, details, function (err, content) {
//         if (err) {
//         	return next(err);
//         } else {
//         	//content = _.pick(content, []);
//         	res.status(200).json(content);
//         }
//     });
// };