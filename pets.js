const Service = require('./lib/service');
const log = require('./lib/log');

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
		status: () => Promise.resolve({ service: 'pets', status: 'ok' }),
		getPetsByIds: ids => {
			if (!ids || !ids.length) {
				return Promise.reject('no pets found');
			}
			return Promise.resolve(db.filter(doc => ids.indexOf(doc.id) > -1).map(doc => doc.name));
		}
	}
});

pets.start()
	.then(socket => {})
	.catch(log.bind(null, 'error'));
