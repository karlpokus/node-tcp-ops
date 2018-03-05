const Service = require('./lib/service');

const db = [
	{ name: 'bob', pets: [1, 3] },
	{ name: 'jane', pets: [] }
];

const people = new Service({
	name: 'people',
	port: 5002,
	host: 'localhost',
	commands: {
		status: () => Promise.resolve({ service: 'people', status: 'ok' }),
		getAllPeople: () => Promise.resolve(db.map(doc => doc.name)),
		createPerson: payload => {
			payload.pets = [];
			db.push(payload);
			return Promise.resolve('person created');
		},
		getPetIdsByOwner: ({ owner }) => {
			if (!owner) {
				return Promise.reject('owner missing from args');
			}
			return Promise.resolve(db.filter(doc => doc.name === owner)[0].pets);
		}
	}
});

people.start()
	.then(socket => {})
	.catch(console.error.bind(console));
