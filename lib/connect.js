const net = require('net');

function makeConnection(services, service, success, fail) {
	const { name, port } = service;

	services[name] = net.connect(port);

	services[name]
		.on('connect', success)
		.once('error', fail)
		.on('end', () => {
			console.warn(`lost connection to ${ name }`);
			connectToService(services, service)
				.then(() => console.log(`reestablished connection to ${ name }`))
				.catch(() => {
					console.error(`unable to connect to ${ name } exiting now`);
					process.exit(1);
				});
		});
}

function connectToService(services, service) {
	const { name } = service;

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
			console.warn(`connecting to ${ name }`);
		}

		const reconnect = () => {
			console.warn(`connecting to ${ name }`);

			timer = setInterval(() => {
				if (fails < 5) {
					makeConnection(services, service, success, fail);
				} else {
					reject();
				}
			}, 5000);
		}

		makeConnection(services, service, success, reconnect);
	});
}

module.exports = connectToService;
