const net = require('net'),
      people = net.createServer(),
      PORT = 5002,
      HOST = 'localhost';
			db = ['bob', 'jane'];

const commands = {
	getAll: () => db,
	create: x => {
		db.push(x.name);
		return { result: `${ x.name } created`}
	}
};

people
	.on('connection', function(socket){
		console.log('api connected to people');

    socket
    	.on('close', () => console.log('people socket closed'))
			.on('data', chunk => {
				const payload = JSON.parse(chunk);
				socket.write(JSON.stringify({
					data: commands[payload.cmd](payload.payload)
				}));

			});
	})
	.on('close', () => console.log('people server closed'))
	.on('error', err => console.error(err))
	.listen(PORT, HOST, () => console.log('people running on', PORT));
