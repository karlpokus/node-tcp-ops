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
		status: () => ({ people: 'ok' }),
		getAllPeople: () => db.map(doc => doc.name),
		createPerson: payload => {
			payload.pets = [];
			db.push(payload);
			return { queryresult: 'person created' };
		},
		getPetIdsByOwner: ({ owner }) => db.filter(doc => doc.name === owner).map(doc => doc.pets)[0]
	}
});

people.start()
	.then(socket => {})
	.catch(console.error.bind(console));
