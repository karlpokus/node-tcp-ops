const connectToServices = require('./lib/connect');
const startHttp = require('./lib/http');
const log = require('./lib/log');
const availableServices = [
	{ name: 'people', port: 5002},
	{ name: 'pets', port: 5003},
	{ name: 'remote', port: 5004}
];

connectToServices(availableServices)
	.then(startHttp)
	.catch(err => log.bind(null, 'error'));
