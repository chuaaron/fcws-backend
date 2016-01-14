var ContentProxy= require('../proxy/content.js');
var lengthLimit = 15;

module.exports.index = function(req,res,next){
    var query = {};
    var category = req.query.category;
    var sub_category = req.query.sub_category;
    if(category){
        query.category = category;
    }
    if(sub_category){
        query.sub_category = sub_category;
    }

    ContentProxy.getContents(query,function(err,contents){
        if(err){
            req.flash("error", err.message);
            return req.status(500).json();
        }else{
            contents= contents.map(function(content){
                if(content.title.length > lengthLimit){
                    content.title = content.title.slice(0,lengthLimit)+"...";
                }
                return content;
            });

            res.render('contents', {title: "内容管理",contents: contents});
        }
    });
};

module.exports.editor = function(req,res,next){
    res.render('editor', {title: "新建文档",action: "create"});
};

module.exports.showEditor= function(req,res,next){
    var content_id = req.params.id;

    ContentProxy.getContentsById(content_id,function(err,content){
        if(err || !content){
            req.flash("error","此文档不存在或已被删除");
            return res.redirect('/contents');
        }

        res.render('editor', {
            title : '编辑文档',
            action: 'edit',
            content_id: content.id,
            content_title: content.title,
            category : content.category,
            sub_category: content.sub_category,
            details: content.details,
        });
    })
};

module.exports.create= function(req,res,next){
    var title = req.body.title;
    var category = req.body.category;
    var sub_category = req.body.sub_category;
    var details = req.body.details;

    ContentProxy.newAndSave(title,category,sub_category,details,function(err,content){
        if (err) {
            req.flash("error", "创建失败");
            //return res.status(500).json();
            return res.redirect('/contents');
        } else {
            req.flash('success', "新文档<" + content.title+ ">创建成功");
            res.redirect('/contents');
        }
    });
};

module.exports.update= function(req,res,next){
    var id = req.params.id;
    var title = req.body.title;
    var category = req.body.category;
    var sub_category = req.body.sub_category;
    var details = req.body.details;

    ContentProxy.updateContentsById(id,title,category,sub_category,details,function(err,content){
        if (err) {
            req.flash("error", "更新失败");
            //return res.status(500).json();
            console.log(err.message);
           return  res.redirect('/contents');
        } else {
            req.flash('success', "文档<" + content.title+ ">更新成功");
            res.redirect('/contents');
        }
    });
};



module.exports.delete= function(req,res,next){
    var content_id= req.params.id;

    ContentProxy.deleteContentsById(content_id,function(err,content){
        //404 not found
        if (err || !content) {
            req.flash("error", "文档" + content_id + "不存在!");
            return res.status(404).send({'error_msg': 'content' + content_id + ' not found'});
        }

        req.flash("success", "文档" + content_id + "已被删除!");
        res.status(204).json();
    });

};
