var app = require('../../../app');
var www = require('../../../bin/www');
var request = require('supertest')(app);
var support = require('../../support/support');
var should = require('should');
var eventproxy = require('eventproxy');
var _       = require('lodash');

describe('test /api/v1/contents.test.js', function () {
    var mockUser;
    before(function (done) {
        support.createUser(function (err, user) {
            if (err) done(err);
            mockUser = user;
            done();
        });
    });

    describe('test post /api/v1/contents', function () {

        var mockContent;
        before(function (done) {
            support.createContent(function (err, content) {
                if (err) done(err);
                mockContent = content;
                done();
            });
        });

        it('should get content details after markdown render', function (done) {
            request.get('/api/v1/contents/' + mockContent.id)
                .send({access_token: mockUser.accessToken})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    var content = res.body;
                    content.should.not.be.empty();
                    done();
                });
        });

        it('should get content created before in its category and subcategory', function (done) {
            request.get('/api/v1/contents/subcategory')
                .send({access_token: mockUser.accessToken,
                    category: mockContent.category,
                    sub_category : mockContent.sub_category
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    var contents = res.body;
                    contents.should.be.an.Array;
                    contents.length.should.be.equal(1);
                    done();
                });
        });
    });
});