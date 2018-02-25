const querystring = require('querystring');
const url = require('url');

const router = {
	GET: {},
	POST: {},
	go: function(req, res) {
		const method = req.method;
		const { pathname, query } = url.parse(req.url);
		const data = querystring.parse(query);
		
		this[method][pathname](req, res, data);
	},
	add: function(method, path, fn) {
		this[method][path] = fn;
	}
};

module.exports = router;
