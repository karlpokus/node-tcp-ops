const test = require('tape');
const http = require('http');
const { execFile } = require('child_process');

const run = (cmd, args) => new Promise(resolve => execFile(cmd, args, resolve)); // error, stdout, stderr
const stopAll = cb => execFile('npm', ['run', 'stop'], cb);
const waitForConnections = wait => () => new Promise(resolve => setTimeout(resolve, wait));
const checkStatus = () => new Promise(resolve => {
	http.request('http://localhost:5001/status')
		.on('response', res => {
			res.on('data', chunk => resolve(JSON.parse(chunk)))
		})
		.end();
});

test.onFinish(stopAll);

test('no dependency on startup order', t => {
	run('npm', ['start'])
		.then(waitForConnections(5000))
		.then(checkStatus)
		.then(status => {
			t.equal(status.length, 3, 'api connects to all services');
			t.end();
		});
});

test('restart service pets', t => {
	run('pm2', ['restart', 'pets'])
		.then(waitForConnections(4000))
		.then(checkStatus)
		.then(status => {
			t.equal(status.length, 3, 'api reconnects');
			t.end();
		});
});

test('restarting api', t => {
	run('pm2', ['restart', 'api'])
		.then(waitForConnections(2000))
		.then(checkStatus)
		.then(status => {
			t.equal(status.length, 3, 'api reconnects');
			t.end();
		});
});
