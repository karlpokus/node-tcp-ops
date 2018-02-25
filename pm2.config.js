const procs = [
	'people',
	'api'
];

const singleConfig = proc => ({
	name: proc,
	script: `./${ proc }.js`,
	//watch: `./${ proc }.js`,
	log_date_format: 'YYYY-MM-DD HH:mm Z'
});

module.exports = {
	apps: procs.map(singleConfig)
};
