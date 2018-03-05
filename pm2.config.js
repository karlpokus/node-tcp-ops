const procs = [
	'api',
	'people',
	'pets',
	'remote'
];

const singleConfig = proc => ({
	name: proc,
	script: `./${ proc }.js`,
	watch: `./${ proc }.js`,
	log_date_format: 'YYYY-MM-DD HH:mm Z',
	max_memory_restart: '500M',
	max_restarts: 10,
	//instances: 2,
	//exec_mode: 'cluster'
});

module.exports = {
	apps: procs.map(singleConfig)
};
