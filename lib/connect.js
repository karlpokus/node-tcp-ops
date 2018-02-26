const net = require('net');

function makeConnection(services, service, port, success, fail) {
	services[service] = net.connect(port);

	services[service]
		.on('connect', success)
		.once('error', fail)
		.on('end', () => {
			console.warn(`lost connection to ${ service }`);
			connectToService(services, service, port)
				.then(() => console.log(`reestablished connection to ${ service }`))
				.catch(() => {
					console.error(`unable to connect to ${ service } exiting now`);
					process.exit(1);
				});
		});
}

function connectToService(services, service, port) {
	return new Promise((resolve, reject) => {
		let timer;
		let fails = 0;

		const success = () => {
			if (timer) {
				clearInterval(timer);
			}
			resolve();
		}

		const fail = () => {
			fails++;
			console.warn(`connecting to ${ service }`);
		}

		const reconnect = () => {
			console.warn(`connecting to ${ service }`);

			timer = setInterval(() => {
				if (fails < 5) {
					makeConnection(services, service, port, success, fail);
				} else {
					reject();
				}
			}, 5000);
		}

		makeConnection(services, service, port, success, reconnect);
	});
}

module.exports = connectToService;
