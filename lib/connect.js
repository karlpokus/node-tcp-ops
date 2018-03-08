const net = require('net');
const log = require('./log');
const maxFails = 5;
const interval = 2000;

function makeConnection(services, service, success, fail) {
	const { name, port } = service;

	services[name] = net.connect(port);

	services[name]
		.on('connect', success)
		.once('error', fail)
		.on('end', () => {
			log('warn', `lost connection to ${ name }`);
			connectToService(services, service)
				.then(() => log(`reestablished connection to ${ name }`))
				.catch(() => {
					log('error', `unable to connect to ${ name } exiting now`);
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
			log('warn', `connecting to ${ name }`);
		}

		const reconnect = () => {
			log('warn', `connecting to ${ name }`);

			timer = setInterval(() => {
				if (fails < maxFails) {
					makeConnection(services, service, success, fail);
				} else {
					reject();
				}
			}, interval);
		}

		makeConnection(services, service, success, reconnect);
	});
}

function connectToServices(availableServices) {
	let services = {};

	return new Promise(resolve => {
		Promise.all(availableServices.map(service => connectToService(services, service)))
			.then(() => {
				log('connected to all services');
				resolve(services);
			})
			.catch(() => {
				log('error', 'unable to connect to all services. exiting now');
				process.exit(1);
			});
	});
}

module.exports = connectToServices;
