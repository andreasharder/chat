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

    var clientMock = { lpush: function () {} };
    var spy = chai.spy(clientMock.lpush);
    var repo = new Repo(clientMock);

    it('should add new message', function() {
        repo.add("list", "message");
        expect(spy).to.have.been.called;
    });
});
