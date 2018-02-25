const http = require('http');
const net = require('net');

const srv = http.createServer();
const router = require('./lib/router');

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

function runQuery(service, cmd, payload, done) {
	service.write(JSON.stringify({ cmd, payload }));
	service.once('data', done);
}

router.add('GET', '/people', (req, res, data) => {
	runQuery(people, 'getAllPeople', null, res.end.bind(res));
});

router.add('POST', '/people', (req, res, data) => {
	runQuery(people, 'createPerson', data, res.end.bind(res));
});

router.add('GET', '/people/pets', (req, res, data) => {
	runQuery(people, 'getPetsByOwner', data, result => {
		runQuery(pets, 'getPetsByIds', JSON.parse(result).result, res.end.bind(res))
	});
});

srv.on('request', router.go.bind(router)).listen(5001, () => {
	connectToPeople();
	connectToPets();
});
