const net = require('net');
const log = require('./log');

const service = function(opts) {
	this.opts = opts;
}

service.prototype.start = function() {
	const { port, host, name, commands } = this.opts;

	return new Promise((resolve, reject) => {
		const server = net.createServer();

		server
			.on('connection', socket => {
		    socket
		    	.on('close', () => log('socket closed'))
					.on('data', chunk => {
						try {
							const { cmd, payload } = JSON.parse(chunk);
							const fn = commands[cmd];

							if (!fn) {
								throw new Error('service command missing');
							}

							fn(payload)
								.then(res => socket.write(JSON.stringify({ res })))
								.catch(err => socket.write(JSON.stringify({ err })));

						} catch(err) {
							socket.write(JSON.stringify({
								err: err.message || 'malformed service payload'
							}));
						}
					});

				resolve(socket);
			})
			.on('close', () => log('server closed'))
			.on('error', reject)
			.listen(port, host, () => {
				log(`${ name } is up`)
			});
	});
}

module.exports = service;
