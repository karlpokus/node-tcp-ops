const net = require('net');

const makeConnection = (services, service, port, success, fail) => {
	services[service] = net.connect(port);

	services[service]
		.on('connect', success)
		.once('error', fail)
		.on('end', () => console.log(`${ service } socket ended`));
}

const connectToService = (services, service, port, fails) => {
	let timer;

	const success = () => {
		if (timer) {
			clearInterval(timer);
		}
		console.log(`connected to ${ service }`);
	}

	const fail = () => {
		fails++;
		console.warn(`connecting to ${ service }`);
	}

	const reconnect = () => {
		console.log(`connecting to ${ service }`);

		timer = setInterval(() => {
			if (fails < 5) {
				makeConnection(services, service, port, success, fail);
			} else {
				process.exit(1);
			}
		}, 5000);
	}

	makeConnection(services, service, port, success, reconnect);
}

module.exports = connectToService;
