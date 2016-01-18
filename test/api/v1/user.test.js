var app = require('../../../app');
var www = require('../../../bin/www');
var request = require('supertest')(app);
var support = require('../../support/support');
var should = require('should');

describe('test/api/v1/user.test.js', function () {

    describe('test get /api/v1/auth/local', function () {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) done(err);
                //should.not.exists(err);
                mockUser = user;
                done();
            });
        });

        it('should get user info', function (done) {
            request.get('/api/v1/auth/local')
                .send({id: mockUser.id, password: mockUser.id})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.name.should.equal(mockUser.name);
                    res.body.accessToken.should.equal(mockUser.accessToken);
                    done();
                });
        });

        it('should not get user info if id & password mismatch', function (done) {
            request.get('/api/v1/auth/local')
                .send({id: "unknown", password: "unknown"})
                .expect(401)
                .end(function (err, res) {
                    should.not.exists(err);
                    done();
                });
        });
    })

    describe('test post /api/v1/users/changePassword', function () {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should reset password success if id & password correct', function (done) {
            var newpassword = '123';
            request.post('/api/v1/users/changePassword')
                .send({
                    id: mockUser.id,
                    password: mockUser.id,
                    new_password: newpassword
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    done();
                });
        });

        it('should not login with old password', function (done) {
            request.get('/api/v1/auth/local')
                .send({id: mockUser.id, password: mockUser.id})
                .expect(401)
                .end(function (err, res) {
                    should.not.exists(err);
                    done();
                });
        })
    });

    describe('test get /api/v1/users/details', function (done) {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should return detail info of user', function (done) {
            request.get('/api/v1/users/details')
                .send({access_token: mockUser.accessToken})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.should.have.property('recent_posts');
                    res.body.should.have.property('recent_replies');
                    done();
                });
        })
    });

    describe('test get /api/v1/users/belongs', function (done) {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should return belongs of user', function (done) {
            request.get('/api/v1/users/belongs')
                .send({access_token: mockUser.accessToken})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    var users = res.body;
                    users.should.be.an.Array;
                    //console.log(users);
                    //for(var i = 0 ;i < users.length ; i++){
                    //    var user = users[i];
                    //    user.role.should.be.above(mockUser.role);
                    //}

                    done();
                });
        })
    });

});
