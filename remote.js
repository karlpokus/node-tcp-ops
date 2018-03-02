const Service = require('./lib/service');
const http = require('http');

const remoteCall = url => {
	return new Promise((resolve, reject) => {
		const req = http.request(url);
		let data = '';

		req
			.on('error', reject)
			.on('response', res => {
				res
					.on('data', chunk => {
						data += chunk;
					})
					.on('end', () => {
						resolve(JSON.parse(data).md5);
					});
			});

		req.end();
	});
}

const remote = new Service({
	name: 'remote',
	port: 5004,
	host: 'localhost',
	commands: {
		status: () => Promise.resolve({ remote: 'ok' }),
		getHash: ({ str }) => remoteCall(`http://md5.jsontest.com/?text=${ str }`)
	}
});

remote.start()
	.then(socket => {})
	.catch(console.error.bind(console));
