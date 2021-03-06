module.exports = {
    sessionSecret : 'productionSessionSecret',
    db: 'mongodb://localhost/fcws_expr',
    upload: {
        url: '/public/uploads/'
    },
    recentCount : 5,
    admin: {
        username: 'admin',
        password: 'admin'
    },
    roles : [['1', '1级(司令同级)'],
        ['2', '2级(副司令同级)'],
        ['3', '3级(参谋同级)'],
        ['4', '4级(区域部长同级)'],
        ['5', '5级(区域副部长同级)'],
        ['6', '6级(民兵同级)'],
    ],
};