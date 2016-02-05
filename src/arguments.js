function getPort(arguments) {

	var port = 8080;

	arguments.forEach(function (val, index, array) {
		if (val.indexOf("port=") > -1) {
			var portString = val.substring(5);
			var portNumber = parseInt(portString, 10);
			if (portNumber == portString) {
				port = portNumber;
			}
		}
	})
	
	return port;
}

module.exports = getPort;
