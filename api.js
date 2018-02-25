const http = require('http');
const net = require('net');

const srv = http.createServer();
const router = require('./lib/router');

let people; // socket
let pets;

const connectToPeople = () => {
	people = net.connect(5002);

	people
	  .on('connect', () => {
			console.log('api connected to people')
		})
		.on('data', () => {})
	  .on('end', () => {
	    console.log('people socket ended');
	  });
};

const connectToPets = () => {
	pets = net.connect(5003);

	pets
	  .on('connect', () => {
			console.log('api connected to pets')
		})
		.on('data', () => {})
	  .on('end', () => {
	    console.log('pets socket ended');
	  });
};

function runQuery(service, cmd, payload, res) {
	// req.pipe(people, {end: false}).once('data', res.end.bind(res));
	service.write(JSON.stringify({ cmd, payload }));
	service.once('data', res.end.bind(res)); // add res.writeHead(<num>) here
}

router.add('GET', '/people', (req, res, data) => {
	runQuery(people, 'getAll', null, res);
});

router.add('POST', '/people', (req, res, data) => {
	runQuery(people, 'create', data, res);
});

srv.on('request', router.go.bind(router)).listen(5001, () => {
	connectToPeople();
	//connectToPets();
});
