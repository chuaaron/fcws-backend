var app = require('../../../app');
var www = require('../../../bin/www');
var request = require('supertest')(app);
var support = require('../../support/support');
var should = require('should');
var eventproxy = require('eventproxy');
var _       = require('lodash');

describe('test /api/v1/districts.test.js', function () {

    describe('test post /api/v1/districts', function () {
        var mockUser;
        var districts=[];
        before(function (done) {
            support.createUser(function (err, user) {
                if (err) done(err);
                mockUser = user;
                done();
            });
        });

        it('should get district array', function (done) {
            request.get('/api/v1/districts')
                .send({access_token: mockUser.accessToken})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    districts = res.body;
                    districts.should.be.an.Array;
                    var length = districts.length;
                    length.should.be.above(0);
                    done();
                });
        });

        it('should get towns array', function (done) {
            var random = _.random(0,districts.length - 1);
            var randomDistrict = districts[random].name;
            request.get('/api/v1/districts/towns')
                .send({access_token: mockUser.accessToken,
                        district:randomDistrict
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.should.be.an.Array;
                    done();
                });
        });
    });
});