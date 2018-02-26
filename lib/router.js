const querystring = require('querystring');
const url = require('url');

const router = {
	GET: {},
	POST: {},
	go: function(req, res) {
		const method = req.method;
		const { pathname, query } = url.parse(req.url);
		const data = querystring.parse(query);

		if (!this[method][pathname]) {
			res.writeHead(404);
			return res.end('That´s a 404');
		}
		this[method][pathname](req, res, data);
	},
	add: function(method, path, fn) {
		this[method][path] = fn;
	}
};

module.exports = router;
