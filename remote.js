const Service = require('./lib/service');
const http = require('http');
const url = require('url');
const log = require('./lib/log');

const request = dest => {
	return new Promise((resolve, reject) => {
		const proxy = process.env.HTTP_PROXY;
		let opts;

		if (proxy) {
			const { hostname, port } = url.parse(proxy);
			opts = { hostname, port, path: dest };

		} else {
			const { host, search } = url.parse(dest);
			opts = { host, path: `/${ search }`}
		}

		http.request(opts)
			.on('error', reject)
			.on('response', res => {
				res.on('data', chunk => {
					resolve(JSON.parse(chunk.toString()).md5);
				});
			})
			.end();
	});
}

const remote = new Service({
	name: 'remote',
	port: 5004,
	host: 'localhost',
	commands: {
		status: () => Promise.resolve({ service: 'remote', status: 'ok' }),
		getHash: ({ text }) => request(`http://md5.jsontest.com/?text=${ text }`)
	}
});

remote.start()
	.then(socket => {})
	.catch(log.bind(null, 'error'));
