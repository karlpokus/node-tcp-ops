const Service = require('./lib/service');
const http = require('http');

const remoteCall = url => {
	return new Promise((resolve, reject) => {

		http.request(url)
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
		status: () => Promise.resolve({ remote: 'ok' }),
		getHash: ({ str }) => remoteCall(`http://md5.jsontest.com/?text=${ str }`)
	}
});

remote.start()
	.then(socket => {})
	.catch(console.error.bind(console));
