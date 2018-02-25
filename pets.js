const net = require('net'),
      pets = net.createServer(),
      PORT = 5003,
      HOST = 'localhost',
			db = [
				{ id:1, name:'bixa' },
				{ id:2, name:'kitty' },
				{ id:3, name:'rex' }
			];

const commands = {
	getPetsByIds: ids => db.filter(doc => ids.indexOf(doc.id) > -1).map(doc => doc.name)
};

pets
	.on('connection', function(socket){
		console.log('api connected to pets');

    socket
    	.on('close', () => console.log('pet socket closed'))
			.on('data', chunk => {
				const payload = JSON.parse(chunk);
				socket.write(JSON.stringify({
					result: commands[payload.cmd](payload.payload)
				}));
			});
	})
	.on('close', () => console.log('people closed'))
	.on('error', (err) => console.error(err))
	.listen(PORT, HOST, () => console.log('pets running on', PORT));
