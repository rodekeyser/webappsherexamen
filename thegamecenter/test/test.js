var chai = require('chai');
var request = require('request');

var expect = chai.expect;
describe("The Game Center's API test", function(){
    describe('testing the tests', function () {
        it('fails', function () {
            expect(7).to.equal(1);
            done();
        });
        it('succeeds', function () {
            expect(7).to.equal(7);
        });
    });
    describe('Getting a game', function () {
        var url = "http://localhost:3000/games/59977271b34bfe0011cd4c37"
        it('returns status code 200', function () {
            request(url, function (err, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        it('returns a game', function () {
            request(url, function (err, response, body) {
                expect(body).contain('title');
                done();
            });
        });
    });
    describe('Getting all players', function () {
        var url = "http://localhost:3000/players"
        it('returns status code 200', function () {
            request(url, function (err, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        it('returns players', function(){
            request(url, function(err, response, body){
                expect(body).contain('userName');
                done();
            });
        });
    });
    describe('Posting a game', function () {
        var url = "http://localhost:3000/games"
        var game= {
            title: "testobjectje",
            link: "test.com",
            description: "this is the description"
        }
        it('returns status code 200', function () {
            request(url, game, function (err, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        it('returns added game', function(){
            request(url, game, function(err, response, body){
                expect(body).contain('testobjectje');
                done();
            });
        });
    });
});