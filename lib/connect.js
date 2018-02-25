const net = require('net');

const makeConnection = (services, service, port, success, fail) => {
	services[service] = net.connect(port);

	services[service].on('connect', success)
		.on('end', () => console.log(`${ service } socket ended`))
		.once('error', fail);
}

const connectToService = (services, service, port, fails) => {
	const timer = setInterval(() => {
		if (fails < 5) {
			makeConnection(services, service, port, () => {
				clearInterval(timer);
				console.log(`api connected to ${ service }`);
			}, () => {
				fails++;
				console.warn(`connecting to ${ service }`);
			});
		} else {
			process.exit(1);
		}
	}, 2000);
}

module.exports = connectToService;
