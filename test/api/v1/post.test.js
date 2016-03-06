var app = require('../../../app');
var www = require('../../../bin/www');
var request = require('supertest')(app);
var support = require('../../support/support');
var should = require('should');

describe('test /api/v1/post.test.js', function () {
    var mockUser;
    before(function (done) {
        support.createUser(function (err, user) {
            if (err) done(err);
            mockUser = user;
            done();
        });
    });
    describe('test post /api/v1/posts', function () {
        it('should create new post', function (done) {
            request.post('/api/v1/posts')
                .send({access_token: mockUser.accessToken,
                    content : "test 消息",
                    important: true
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.author_id.should.equal(mockUser.id);
                    res.body.important.should.be.true;
                    done();
                });
        });

        // it('should not create new post when content is empty', function (done) {
        //     request.post('/api/v1/posts')
        //         .send({access_token: mockUser.accessToken,content: ""})
        //         .expect('Content-Type', /json/)
        //         .expect(422)
        //         .end(function (err, res) {
        //             should.not.exists(err);
        //             res.body.error_msg.should.containEql("内容不能为空");
        //             done();
        //         });
        // });
    });

    describe('test get /api/v1/posts',function()
    {
        it('should get posts', function (done) {
            var limit = 10;
            request.get('/api/v1/posts')
                .send({
                    access_token: mockUser.accessToken,
                    limit :limit,
                    page: 1
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.should.be.an.Array;
                    var length = res.body.length;
                    length.should.not.be.above(limit);
                    done();
                });
        });
    });

    describe('test get  /api/v1/posts/:id',function(){
        var mockPost;
        before(function (done) {
            support.createPost(mockUser.id,function(err,post){
                if(err) done(err);
                mockPost = post;
                done();
            })
        });

        it('should get detailed post info', function (done) {
            request.get('/api/v1/posts/'+ mockPost.id)
                .send({
                    access_token: mockUser.accessToken,
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body._id.should.equal(mockPost.id);
                    done();
                });
        });
    });

    describe('test delete /api/v1/posts/:id',function(){
        var mockPost;
        var anotherMockUser;
        before(function (done) {
            support.createPost(mockUser.id,function(err,post){
                if(err) done(err);
                mockPost = post;
                support.createUser(function(err,user){
                    if(err) done(err);
                    anotherMockUser = user;
                    done();
                })
            })
        });

        it('should  not delete specific post when not author', function (done) {
            request.del('/api/v1/posts/'+ mockPost.id)
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

        it('should  delete specific post ', function (done) {
            request.del('/api/v1/posts/'+ mockPost.id)
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

        it('should not delete a post not exsited', function (done) {
            request.del('/api/v1/posts/' + mockPost.id)
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