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

    describe('test get /api/v1/users/recentposts', function (done) {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should return recentposts of user', function (done) {
            request.get('/api/v1/users/recentposts')
                .send({access_token: mockUser.accessToken})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    // res.body.should.have.property('recent_posts');
                    done();
                });
        })
    });

    describe('test get /api/v1/users/recentreplies', function (done) {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should return recentreplies of user', function (done) {
            request.get('/api/v1/users/recentreplies')
                .send({access_token: mockUser.accessToken})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    // res.body.should.have.property('recent_posts');
                    done();
                });
        })
    });

    describe('test get /api/v1/users/levels', function (done) {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should return levels of user', function (done) {
            request.get('/api/v1/users/levels')
                .send({access_token: mockUser.accessToken})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    // res.body.should.have.property('recent_posts');
                    done();
                });
        })
    });


    describe('test get /api/v1/contacts/area', function (done) {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should return users of area', function (done) {
            request.get('/api/v1/contacts/area')
                .send({access_token: mockUser.accessToken,
                        area: "兴化市",
                        town: "沈伦镇"})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    // res.body.should.have.property('recent_posts');
                    done();
                });
        })
    });

    describe('test get /api/v1/contacts/search', function (done) {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should return user by name key', function (done) {
            request.get('/api/v1/contacts/search')
                .query({access_token: mockUser.accessToken,
                        key: mockUser.name})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    // res.body.should.have.property('recent_posts');
                    done();
                });
        })
    });

     describe('test get /api/v1/contacts/:id', function (done) {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should return user by id', function (done) {
            request.get('/api/v1/contacts/:id')
                .query({access_token: mockUser.accessToken,
                        id: mockUser.id})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    // res.body.should.have.property('recent_posts');
                    done();
                });
        })
    });

     describe('test get /api/v1/users/avatar', function (done) {
        var mockUser;
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) return done(err);
                mockUser = user;
                done();
            });
        });

        it('should upload user avatar', function (done) {
            request.post('/api/v1/users/avatar')
                .send({access_token: mockUser.accessToken,
                        image:"data:image/jpg;base64,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"})
                .expect('Content-Type', /text/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    // res.body.should.have.property('recent_posts');
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
                .query({access_token: mockUser.accessToken})
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
