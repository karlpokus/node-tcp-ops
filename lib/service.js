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
				console.log('socket connected');

		    socket
		    	.on('close', () => console.log('socket closed'))
					.on('data', chunk => {
						const payload = JSON.parse(chunk);
						socket.write(JSON.stringify(commands[payload.cmd](payload.payload)));
					});

				resolve(socket);
			})
			.on('close', () => console.log('server closed'))
			.on('error', reject)
			.listen(port, host, () => {
				console.log(`${ name } running on ${ port }`)
			});
	});
}

module.exports = service;
