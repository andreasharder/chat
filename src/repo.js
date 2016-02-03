var Repo = (function() {

	function Repo(client) {
		this.client = client;
	}

	Repo.prototype.add = function (channel, message) {
		this.client.lpush(channel, message);
	};

	Repo.prototype.getAllByCannel = function (channel, callback) {
		this.client.lrange(channel, 0, 10, callback);
	};

	return Repo;
})();

exports.Repo = Repo;
