const http = require('http');

const srv = http.createServer();
const router = require('./lib/router');
const query = require('./lib/query');
const connectToService = require('./lib/connect');

// sockets
let services = {};

const connectToServices = () => {
	Promise.all([
		connectToService(services, 'people', 5002),
		connectToService(services, 'pets', 5003)
	]).then(() => console.log('api connected to all services'))
	.catch(() => {
		console.error(`unable to connect to all services. exiting now`);
		process.exit(1);
	});
}

const errHandler = (res, err) => {
	console.error(err);
	res.writeHead(500);
	res.end(err.msg || 'error: 500');
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
		.then(petIds => query(services.pets, 'getPetsByIds', JSON.parse(petIds)))
		.then(petList => res.end(petList))
		.catch(errHandler.bind(null, res));
});

router.add('GET', '/status', (req, res, data) => {
	const statusPayloads = Object.keys(services)
		.map(service => query(services[service], 'status', null))

	Promise.all(statusPayloads)
		.then(stats => res.end(stats.toString()))
		.catch(errHandler.bind(null, res));
});

srv.on('request', router.go.bind(router))
	.listen(5001, connectToServices);
