const http = require('http');
const assert = require('assert');

const options = {
	hostname: '127.0.0.1',
	port: 3000,
	path: '/events',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	}
};

const options_del = {
	hostname: '127.0.0.1',
	port: 3000,
	path: '/events/1',
	method: 'DELETE',
	headers: {
		'Content-Type': 'application/json'
	}
};

const options_update = {
	hostname: '127.0.0.1',
	port: 3000,
	path: '/events/2',
	method: 'PUT',
	headers: {
		'Content-Type': 'application/json'
	}
};

const updateData = JSON.stringify({
	'id': 2,
	'topics': 'updated_topic',
	'thumbnail': '/img/tr-3.jpeg',
	'url': 'index.html',
	'overrideURL': '',
	'linkType': '',
	'title': 'Created by Postman',
	'summary': 'Lorem ipsum dolor sit amet'
});

const postData = JSON.stringify({
	'topics': 'my new topic',
	'thumbnail': '/img/tr-3.jpeg',
	'url': 'index.html',
	'overrideURL': '',
	'linkType': '',
	'title': 'Created by Postman',
	'summary': 'Lorem ipsum dolor sit amet'
});

describe("test http server", function() {
	describe("test GET", function() {
		it("see get all events response", function(done) {
			http.get("http://localhost:3000/events", function(response) {
				assert.equal(response.statusCode, 200);
				let bodyResult = '';
				response.on('data', (chunk) => {
					bodyResult += chunk;
				});

				response.on("end", function() {
					bodyResult = JSON.parse(bodyResult);
					assert.equal(bodyResult.length, 12);
					done();
				});
			});
		});
		it("see get only one event response", function(done) {
			http.get("http://localhost:3000/events/4", function(response) {
				assert.equal(response.statusCode, 200);
				let bodyResult = '';
				response.on('data', (chunk) => {
					bodyResult += chunk;
				});

				response.on("end", function() {
					bodyResult = JSON.parse(bodyResult);
					assert.equal(Object.keys(bodyResult).length, 8);
					done();
				});
			});
		});
	});

	describe("test POST", function() {
		before(function() {
			const req = http.request(options, (res) => {
				res.setEncoding('utf8');
				assert.equal(res.statusCode, 201);
			});

			req.on('error', (e) => {
				console.error(`problem with request: ${e.message}`);
			});

			req.write(postData);
			req.end();

		});
		it("see get response for posted event", function(done) {
			http.get("http://localhost:3000/events/13", function(response) {
				assert.equal(response.statusCode, 200);
				let bodyResult = '';
				response.on('data', (chunk) => {
					bodyResult += chunk;
				});

				response.on("end", function() {
					bodyResult = JSON.parse(bodyResult);
					assert.equal(Object.keys(bodyResult).length, 8);
					done();
				});
			});
		});
	});

	describe("test DELETE", function() {
		before(function() {
			const req = http.request(options_del, (res) => {
				res.setEncoding('utf8');
			});

			req.on('error', (e) => {
				console.error(`problem with request: ${e.message}`);
			});
			req.end();

		});
		it("see get response for deleted event", function(done) {
			http.get("http://localhost:3000/events/1", function(response) {
				let bodyResult = '';
				response.on('data', (chunk) => {
					bodyResult += chunk;
				});

				response.on("end", function() {
					bodyResult = JSON.parse(bodyResult);
					assert.equal(Object.keys(bodyResult).length, 1);
					done();
				});
			});
		});
	});

	describe("test UPDATE", function() {
		before(function() {
			const req = http.request(options_update, (res) => {
				res.setEncoding('utf8');
			});

			req.on('error', (e) => {
				console.error(`problem with request: ${e.message}`);
			});

			req.write(updateData);
			req.end();

		});
		it("see get response for updated event 2", function(done) {
			http.get("http://localhost:3000/events/2", function(response) {
				assert.equal(response.statusCode, 200);
				let bodyResult = '';
				response.on('data', (chunk) => {
					bodyResult += chunk;
				});

				response.on("end", function() {
					const json_obj = JSON.parse(bodyResult);
					assert.equal(json_obj.topics, 'updated_topic');
					done();
				});
			});
		});
	});
});