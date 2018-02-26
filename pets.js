const Service = require('./lib/service');

const db = [
	{ id:1, name:'bixa' },
	{ id:2, name:'kitty' },
	{ id:3, name:'rex' }
];

const pets = new Service({
	name: 'pets',
	port: 5003,
	host: 'localhost',
	commands: {
		status: () => ({ pets: 'ok' }),
		getPetsByIds: ids => db.filter(doc => ids.indexOf(doc.id) > -1).map(doc => doc.name)
	}
});

pets.start()
	.then(socket => {})
	.catch(console.error.bind(console));
