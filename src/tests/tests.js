var chai 	= require('chai');
var expect 	= require('chai').expect;
var spies = require('chai-spies');
var getPort   = require('../argParser.js');
var Repo      = require('../repo.js').Repo;

chai.use(spies);


describe('argParser', function(){
    it('should return default port', function(){
        expect(getPort([])).to.equal(8080);
    });

	it('should return port if exists in arguments', function() {
		var args = ['npm', 'run', 'port=3030'];
		expect(getPort(args)).to.equal(3030);
	});
});


describe('Repo', function() {

    function clientMock() {
        this.hset = function (message, channel) {
        };
    }

    var repo = new Repo(clientMock);
    //var spy = chai.spy(clientMock.hset);

    it('should add new message', function() {
        repo.add(1);
        //expect(spy).to.have.been.called();
    });
});
