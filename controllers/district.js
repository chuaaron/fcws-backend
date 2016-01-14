var DistrictProxy = require('../proxy/district.js');


module.exports.districts = function (req, res, next) {
    DistrictProxy.getDistricts(function (err, districts) {
        if(err || !districts){
            req.flash("error", "区域获取错误");
            return res.status(500).json();
        }
        res.render('districts', {title: "通讯录管理", districts: districts});
    })
};

module.exports.towns= function (req, res, next) {
    var district = req.query.district;
    DistrictProxy.getTowns(district, function (err, towns) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(towns);
        }
    });
};

module.exports.new_towns= function (req, res, next) {
    DistrictProxy.getDistricts(function(err,districts){
        if(err || !districts){
            req.flash("error", "区域获取错误");
            return res.redirect('/districts');
        }
        console.log(districts);
        res.render('edit_town', {title: "新增子区域",action: "create",districts: districts});
    });
};

module.exports.edit_towns = function (req, res, next) {
    var town_name = req.params.name;
    var district = req.query.district;
    DistrictProxy.getDistricts(function(err,districts){
        if(err || !districts){
            req.flash("error", "区域获取错误");
            return res.redirect('/districts');
        }
        return res.render('edit_town', {title: "编辑子区域",action: "edit",districts: districts,district:district,town:town_name});
    });
};

module.exports.update_towns= function(req,res,next){
    var district = req.query.district;
    var old_town = req.params.name;
    var new_town = req.body.town;
    console.log(district + " " + old_town +" " + new_town);
    DistrictProxy.updateTown(district,old_town,new_town,function(err,district){
        if (err || !district) {
            req.flash("error","更新子区域出错: " + err.message);
            return res.redirect('/districts');
        } else {
            req.flash('success', '子区域<' + old_town + '>成功更新为<'+new_town+">,通讯录用户子区域已同步更新");
            res.redirect('/districts');
        }
    });
};


module.exports.create_towns= function (req, res, next) {
    var district = req.body.district;
    var name = req.body.town;
    console.log(name);

    DistrictProxy.newTown(district,name, function (err, District) {
        if (err) {
            req.flash("error", "创建子区域失败");
            return res.redirect('/districts');
        } else {
            req.flash("success", "创建子区域<"+name+">成功");
            return res.redirect('/districts');
        }
    });
};

module.exports.delete_towns= function (req, res, next) {
    var district_name = req.body.district;
    var town_name= req.body.town;
    console.log(district_name+ " " + town_name);

    DistrictProxy.deleteTown(district_name,town_name, function (err, District) {
        if (err) {
            req.flash("error", '删除子区域失败,请检查该区域下有无用户');
            return res.status(500).send('删除子区域失败,请检查该区域下有无用户');
        } else {
            req.flash("success", "删除子区域<"+town_name+">成功");
            return res.status(200).send("删除子区域<"+town_name+">成功");
        }
    });
};



