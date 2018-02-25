const http = require('http');
const net = require('net');

const srv = http.createServer();
const router = require('./lib/router');
const query = require('./lib/query');

let people; // socket
let pets;

const connectToPeople = () => {
	people = net.connect(5002);

	people.on('connect', () => console.log('api connected to people'))
		.on('end', () => console.log('people socket ended'));
};

const connectToPets = () => {
	pets = net.connect(5003);

	pets.on('connect', () => console.log('api connected to pets'))
		.on('end', () => console.log('pets socket ended'));
};

const connectToServices = () => {
	connectToPeople();
	connectToPets();
}

const errHandler = (err) => console.error(err);

router.add('GET', '/people', (req, res, data) => {
	query(people, 'getAllPeople', null)
		.then(people => res.end(people))
		.catch(errHandler);
});

router.add('POST', '/people', (req, res, data) => {
	query(people, 'createPerson', data)
		.then(result => res.end(result))
		.catch(errHandler);
});

router.add('GET', '/people/pets', (req, res, data) => {
	query(people, 'getPetIdsByOwner', data)
		.then(petIds => query(pets, 'getPetsByIds', JSON.parse(petIds)))
		.then(petList => res.end(petList))
		.catch(errHandler);
});

srv.on('request', router.go.bind(router))
	.listen(5001, connectToServices);
