const http = require('http');
const net = require('net');
const querystring = require('querystring');
const url = require('url');

const srv = http.createServer();
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
	service.once('data', res.end.bind(res));
}

srv.on('request', (req, res) => {
	const { pathname, query } = url.parse(req.url);

	if (req.method === 'GET' && pathname === '/people') {
		runQuery(people, 'getAll', null, res);

	} else if (req.method === 'POST' && pathname === '/people') {
		runQuery(people, 'create', querystring.parse(query), res);

	} else if (req.method === 'GET' && pathname === '/pets') {
			//callService(pets, 'getAll', null, res);

	} else if (req.method === 'POST' && pathname === '/pets') {
		//callService(pets, 'create', querystring.parse(query), res);

	} else {
		res.writeHead(404)
		return res.end();
	}
})

// start
srv.listen(5001, () => {
	connectToPeople();
	//connectToPets();
});
