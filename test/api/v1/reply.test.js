var app = require('../../../app');
var www = require('../../../bin/www');
var request = require('supertest')(app);
var support = require('../../support/support');
var should = require('should');

describe('test /api/v1/reply.test.js', function () {
    var mockUser;
    var mockPost;
    before(function (done) {
        support.createUser(function (err, user) {
            if (err) done(err);
            mockUser = user;
            support.createPost(mockUser.id,function(err,post) {
                if (err) done(err);
                mockPost = post;
                done();
            });
        });
    });


    describe('test post /api/v1/replys', function () {
        //正常情况
        it('should create new reply', function (done) {
            request.post('/api/v1/replys')
                .send({
                    access_token: mockUser.accessToken,
                    post_id: mockPost.id,
                    content: "test 回复",
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.success.should.be.true;
                    done();
                });
        });

        //内容为空则422
        it('should not create new reply when content is empty', function (done) {
            request.post('/api/v1/replys')
                .send({
                    access_token: mockUser.accessToken,
                    post_id: mockPost.id,
                    content: "",
                })
                .expect('Content-Type', /json/)
                .expect(422)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.should.have.property('error_msg');
                    done();
                });
        });

        //情报不存在则404
        it('should not create new reply when post_id is not found', function (done) {
            request.post('/api/v1/replys')
                .send({
                    access_token: mockUser.accessToken,
                    post_id: mockPost.id+" not found",
                    content: "test 回复",
                })
                .expect('Content-Type', /json/)
                .expect(404)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.should.have.property('error_msg');
                    done();
                });
        });
    });

    describe('test delete /api/v1/replys/:id', function () {
        var mockReply;
        var anotherMockUser;
        before(function (done) {
            support.createReply(mockUser.id,mockPost.id,function(err,reply){
                if(err) done(err);
                mockReply= reply;
                support.createUser(function(err,user){
                    if(err) done(err);
                    anotherMockUser = user;
                    done();
                });
            })
        });

        it('should not delete specific reply when not author', function (done) {
            request.del('/api/v1/replys/'+ mockReply.id)
                .send({
                    access_token: anotherMockUser.accessToken,
                })
                .expect('Content-Type', /json/)
                .expect(403)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.should.have.property('error_msg');
                    done();
                });
        });

        it('should delete a reply', function (done) {
            request.del('/api/v1/replys/' + mockReply.id)
                .send({
                    access_token: mockUser.accessToken,
                })
                .expect(204)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.should.be.empty;
                    done();
                });
        });

        it('should not delete a reply not exsited', function (done) {
            request.del('/api/v1/replys/' + mockReply.id)
                .send({
                    access_token: mockUser.accessToken,
                })
                .expect('Content-Type', /json/)
                .expect(404)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.should.have.property('error_msg');
                    done();
                });
        });


    });

});