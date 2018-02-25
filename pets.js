/*
const net = require('net'),
      pets = net.createServer(),
      PORT = 5003,
      HOST = 'localhost';
			db = ['bixa', 'rex'];

const actions = {
	getAll: () => db,
	create: x => {
		db.push(x.name);
		return { result: `${ x.name } created`}
	}
};

function onClose(data) {
	console.log('socket closed');
}

pets
	.on('connection', function(socket){
		console.log('api connected to pets');

    socket
    	.on('close', onClose)
			.on('data', chunk => {
				const payload = JSON.parse(chunk);
				socket.write(JSON.stringify({
					data: actions[payload.action](payload.payload),
					id: payload.id
				}));
			});
	})
	.on('close', () => console.log('people closed'))
	.on('error', function(err){
		console.error(err);
	})
	.listen(PORT, HOST, function(){
		console.log('pets running on', PORT);
	});
*/
