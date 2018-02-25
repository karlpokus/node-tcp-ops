module.exports = (service, cmd, payload) => {
	return new Promise((resolve, reject) => {
		service.write(JSON.stringify({ cmd, payload }));
		service.once('data', resolve);
		service.once('error', reject);
  });
}
