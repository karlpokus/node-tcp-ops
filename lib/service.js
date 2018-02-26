const net = require('net');

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
		    	.on('close', () => console.log('socket closed'))
					.on('data', chunk => {
						try {
							const payload = JSON.parse(chunk);
							socket.write(JSON.stringify(commands[payload.cmd](payload.payload)));
						} catch(err) {
							socket.write('error: malformed service payload');
						}
					});

				resolve(socket);
			})
			.on('close', () => console.log('server closed'))
			.on('error', reject)
			.listen(port, host, () => {
				console.log(`${ name } is up`)
			});
	});
}

module.exports = service;
