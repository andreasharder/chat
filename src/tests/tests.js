var expect 		= require('chai').expect;
var getPort      = require('../argParser.js');

describe("argParser", function(){
    it("should return default port", function(){
        expect(getPort([])).to.equal(8080);
    });

	it('should return port if exists in arguments', function() {
		var args = ['npm', 'run', 'port=3030'];
		expect(getPort(args)).to.equal(3030);
	});
});
