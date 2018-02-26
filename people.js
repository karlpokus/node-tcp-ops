const net = require('net'),
      people = net.createServer(),
      PORT = 5002,
      HOST = 'localhost';
			db = [
				{ name: 'bob', pets: [1, 3] },
				{ name: 'jane', pets: [] }
			];

const commands = {
	status: () => ({ people: 'ok' }),
	getAllPeople: () => db.map(doc => doc.name),
	createPerson: payload => {
		payload.pets = [];
		db.push(payload);
		return { queryresult: 'person created' };
	},
	getPetIdsByOwner: ({ owner }) => db.filter(doc => doc.name === owner).map(doc => doc.pets)[0]
};

people
	.on('connection', function(socket){
		console.log('api connected to people');

    socket
    	.on('close', () => console.log('people socket closed'))
			.on('data', chunk => {
				const payload = JSON.parse(chunk);
				socket.write(JSON.stringify(commands[payload.cmd](payload.payload)));
			});
	})
	.on('close', () => console.log('people server closed'))
	.on('error', err => console.error(err))
	.listen(PORT, HOST, () => console.log('people running on', PORT));
