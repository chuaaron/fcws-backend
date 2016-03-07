var app = require('../../../app');
var www = require('../../../bin/www');
var request = require('supertest')(app);
var support = require('../../support/support');
var should = require('should');
var eventproxy = require('eventproxy');


describe('test /api/v1/update.test.js', function () {
        var mockLevel1;
        before(function(done){
            var ep = new eventproxy();
            ep.fail(done);

            ep.all('mockLevel1', function (Level1) {
                mockLevel1 = Level1;

                done();
            });

            support.createUserWithRoleAndArea(1, 0, ep.done('mockLevel1'));
        });

          //正常情况123级发送广播
        it('should get update info', function (done) {
            request.get('/api/v1/update')
                .query({
                    access_token: mockLevel1.accessToken,
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exists(err);
                    done();
                });
        });
  });