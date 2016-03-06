var app = require('../../../app');
var www = require('../../../bin/www');
var request = require('supertest')(app);
var support = require('../../support/support');
var should = require('should');
var eventproxy = require('eventproxy');


describe('test /api/v1/message.test.js', function () {
    //sender role should more than receiver id by 1  and if sender's role is lower than 3,they should be in the same area;


    describe('test post /api/v1/messages/broadcast', function () {
        var mockLevel1;
        var mockLevel6_2;
        before(function(done){
            var ep = new eventproxy();
            ep.fail(done);

            ep.all('mockLevel1', 'mockLevel6_2', function (Level1, Level6_2) {
                mockLevel1 = Level1;
                mockLevel6_2 = Level6_2;

                done();
            });

            support.createUserWithRoleAndArea(1, 0, ep.done('mockLevel1'));
            support.createUserWithRoleAndArea(6, 2, ep.done('mockLevel6_2'));
        });


        //正常情况123级发送广播
        it('should create new broadcast when sender level1 send to their belongs of level2 ', function (done) {
            request.post('/api/v1/messages/broadcast')
                .send({
                    access_token: mockLevel1.accessToken,
                    content: "test broadcast message",
                    selection: [2]
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.success.should.be.true;
                    done();
                });
        });

        // //等级6无法发送广播
        // it('should not create new broadcast when sender is level6 ', function (done) {
        //     request.post('/api/v1/messages/broadcast')
        //         .send({
        //             access_token: mockLevel6_2.accessToken,
        //             content: "test broadcast message",
        //         })
        //         .expect('Content-Type', /json/)
        //         .expect(403)
        //         .end(function (err, res) {
        //             should.not.exists(err);
        //             res.body.should.have.property('error_msg');
        //             done();
        //         });
        // });

    });

    // describe('test post /api/v1/messages', function () {

    //     var mockLevel1;
    //     var mockLevel2;
    //     var mockAnotherLevel2;
    //     var mockLevel4_3;
    //     var mockLevel5_3;
    //     var mockLevel5_2;
    //     before(function (done) {
    //         var ep = new eventproxy();
    //         ep.fail(done);

    //         ep.all('mockLevel1', 'mockLevel2', 'mockAnotherLevel2', 'mockLevel4_3', 'mockLevel5_3', 'mockLevel5_2', function (Level1, Level2, AnotherLevel2, Level4_3, Level5_3, Level5_2) {
    //             mockLevel1 = Level1;
    //             mockLevel2 = Level2;
    //             mockAnotherLevel2 = AnotherLevel2;
    //             mockLevel4_3 = Level4_3;
    //             mockLevel5_3 = Level5_3;
    //             mockLevel5_2 = Level5_2;
    //             done();
    //         });
    //         support.createUserWithRoleAndArea(1, 0, ep.done('mockLevel1'));
    //         support.createUserWithRoleAndArea(2, 0, ep.done('mockLevel2'));
    //         support.createUserWithRoleAndArea(2, 0, ep.done('mockAnotherLevel2'));
    //         support.createUserWithRoleAndArea(4, 3, ep.done('mockLevel4_3'));
    //         support.createUserWithRoleAndArea(5, 3, ep.done('mockLevel5_3'));
    //         support.createUserWithRoleAndArea(5, 2, ep.done('mockLevel5_2'));
    //     });

    //     //正常情况123级发送者的级数比接受者的级数小1
    //     it('should create new message when sender level1 send to their belongs of level2 ', function (done) {
    //         request.post('/api/v1/messages')
    //             .send({
    //                 access_token: mockLevel1.accessToken,
    //                 receiver_id: mockLevel2.id,
    //                 content: "test message",
    //             })
    //             .expect('Content-Type', /json/)
    //             .expect(200)
    //             .end(function (err, res) {
    //                 should.not.exists(err);
    //                 res.body.sender_id.should.equal(mockLevel1.id);
    //                 res.body.receiver_id.should.equal(mockLevel2.id);
    //                 done();
    //             });
    //     });

    //     //正常情况4级以上发送者和接受者在同一区域
    //     it('should create new message when sender above 4 and in same area with receiver  ', function (done) {
    //         request.post('/api/v1/messages')
    //             .send({
    //                 access_token: mockLevel4_3.accessToken,
    //                 receiver_id: mockLevel5_3.id,
    //                 content: "test message",
    //             })
    //             .expect('Content-Type', /json/)
    //             .expect(200)
    //             .end(function (err, res) {
    //                 should.not.exists(err);
    //                 res.body.sender_id.should.equal(mockLevel4_3.id);
    //                 res.body.receiver_id.should.equal(mockLevel5_3.id);
    //                 done();
    //             });
    //     });


    //     //不能向不存在的用户发送命令
    //     it('should create new message when receiver is not existed', function (done) {
    //         request.post('/api/v1/messages')
    //             .send({
    //                 access_token: mockLevel1.accessToken,
    //                 receiver_id: mockLevel2.id + "notexsited",
    //                 content: "test message",
    //             })
    //             .expect('Content-Type', /json/)
    //             .expect(404)
    //             .end(function (err, res) {
    //                 should.not.exists(err);
    //                 res.body.should.have.property('error_msg');
    //                 done();
    //             });
    //     });

    //     //低级不能向高级发送消息
    //     it('should not create new message when sender level2 send to level1', function (done) {
    //         request.post('/api/v1/messages')
    //             .send({
    //                 access_token: mockLevel2.accessToken,
    //                 receiver_id: mockLevel1.id,
    //                 content: "test message",
    //             })
    //             .expect('Content-Type', /json/)
    //             .expect(403)
    //             .end(function (err, res) {
    //                 should.not.exists(err);
    //                 res.body.should.have.property('error_msg');
    //                 done();
    //             });
    //     });

    //     //同级不能互相发消息
    //     it('should not create new message when sender level2 send to level2', function (done) {
    //         request.post('/api/v1/messages')
    //             .send({
    //                 access_token: mockLevel2.accessToken,
    //                 receiver_id: mockAnotherLevel2.id,
    //                 content: "test message",
    //             })
    //             .expect('Content-Type', /json/)
    //             .expect(403)
    //             .end(function (err, res) {
    //                 should.not.exists(err);
    //                 res.body.should.have.property('error_msg');
    //                 done();
    //             });
    //     });

    //     //不能越级发消息
    //     it('should not create new message when sender level2 send to level4', function (done) {
    //         request.post('/api/v1/messages')
    //             .send({
    //                 access_token: mockLevel2.accessToken,
    //                 receiver_id: mockLevel4_3.id,
    //                 content: "test message",
    //             })
    //             .expect('Content-Type', /json/)
    //             .expect(403)
    //             .end(function (err, res) {
    //                 should.not.exists(err);
    //                 res.body.should.have.property('error_msg');
    //                 done();
    //             });
    //     });

    //     //如果级数小于4,发消息时得在同一个区域
    //     it('should not create new message when sender above 4 and not in same area with receiver  ', function (done) {
    //         request.post('/api/v1/messages')
    //             .send({
    //                 access_token: mockLevel4_3.accessToken,
    //                 receiver_id: mockLevel5_2.id,
    //                 content: "test message",
    //             })
    //             .expect('Content-Type', /json/)
    //             .expect(403)
    //             .end(function (err, res) {
    //                 should.not.exists(err);
    //                 res.body.should.have.property('error_msg');
    //                 done();
    //             });
    //     });
    // });


});