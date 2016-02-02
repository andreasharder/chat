var Repo = (function() {

	function Repo(client) {
		this.client = client;
	}

	Repo.prototype.add = function (message, channel) {
		this.client.hmset(channel, message);
	};

	Repo.prototype.getAllByCannel = function (channel) {
		this.client.hgetall(channel, function(err, object) {
			console.log(object);
		});
	};

	return Repo;
})();

exports.Repo = Repo;
