var apkjson = require('../../public/apks/apk.json');

module.exports.update= function (req, res, next) {
    if(!apkjson){
        res.status(404).send({err_msg:"更新文件未找到"});
    }else {
        res.status(200).json(apkjson);
    }
};