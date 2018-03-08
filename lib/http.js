const http = require('http');
const router = require('./router');
const query = require('./query');
const log = require('./log');
const PORT = 5001;

function errHandler(res, err) {
	log('error', err);
	res.writeHead(500);
	res.end();
};

function addRoutes(services) {
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
}

function startHttp(services) {
	return new Promise((resolve, reject) => {
		addRoutes(services);

		http.createServer()
			.on('error', reject)
			.on('request', router.go.bind(router))
			.listen(PORT, () => {
				log('http ready');
				resolve();
			});
	});
}

module.exports = startHttp;
