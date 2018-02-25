const http = require('http');

const srv = http.createServer();
const router = require('./lib/router');
const query = require('./lib/query');
const connectToService = require('./lib/connect');

// sockets
let services = {};

const connectToServices = () => {
	connectToService(services, 'people', 5002, 0);
	connectToService(services, 'pets', 5003, 0);
}

const errHandler = (err) => console.error(err);

router.add('GET', '/people', (req, res, data) => {
	query(services.people, 'getAllPeople', null)
		.then(people => res.end(people))
		.catch(errHandler);
});

router.add('POST', '/people', (req, res, data) => {
	query(services.people, 'createPerson', data)
		.then(result => res.end(result))
		.catch(errHandler);
});

router.add('GET', '/people/pets', (req, res, data) => {
	query(services.people, 'getPetIdsByOwner', data)
		.then(petIds => query(services.pets, 'getPetsByIds', JSON.parse(petIds)))
		.then(petList => res.end(petList))
		.catch(errHandler);
});

srv.on('request', router.go.bind(router))
	.listen(5001, connectToServices);
