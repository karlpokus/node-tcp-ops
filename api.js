const http = require('http');

const srv = http.createServer();
const router = require('./lib/router');
const query = require('./lib/query');
const connectToService = require('./lib/connect');
const availableServices = [
	{ name: 'people', port: 5002},
	{ name: 'pets', port: 5003},
	{ name: 'remote', port: 5004}
];

let services = {}; // sockets

const connectToServices = () => {
	const payload = availableServices.map(service => connectToService(services, service));

	Promise.all(payload)
		.then(() => console.log('api connected to all services'))
		.catch(() => {
			console.error(`unable to connect to all services. exiting now`);
			process.exit(1);
		});
}

const errHandler = (res, err) => {
	console.error(err);
	res.writeHead(500);
	res.end();
};

router.add('GET', '/people', (req, res, data) => {
	query(services.people, 'getAllPeople', null)
		.then(people => res.end(people))
		.catch(errHandler.bind(null, res));
});

router.add('POST', '/people', (req, res, data) => {
	query(services.people, 'createPerson', data)
		.then(result => res.end(result))
		.catch(errHandler.bind(null, res));
});

router.add('GET', '/people/pets', (req, res, data) => {
	query(services.people, 'getPetIdsByOwner', data)
		.then(petIds => query(services.pets, 'getPetsByIds', JSON.parse(petIds).res))
		.then(petList => res.end(petList))
		.catch(errHandler.bind(null, res));
});

router.add('GET', '/status', (req, res, data) => {
	const statusPayloads = Object.keys(services)
		.map(service => query(services[service], 'status', null))

	Promise.all(statusPayloads)
		.then(stats => res.end(JSON.stringify(stats.map(stat => JSON.parse(stat.toString()).res))))
		.catch(errHandler.bind(null, res));
});

router.add('GET', '/hash', (req, res, data) => {
	query(services.remote, 'getHash', data)
		.then(hash => res.end(hash))
		.catch(errHandler.bind(null, res));
});

srv.on('request', router.go.bind(router))
	.listen(5001, connectToServices);
