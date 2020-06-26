const http = require('http');
const assert = require('assert');
let total_lines = 0;

const options_del = {
	hostname: '127.0.0.1',
	port: 3000,
	path: '/events/100',
	method: 'DELETE',
	headers: {
		'Content-Type': 'application/json'
	}
};

const options_update = {
	hostname: '127.0.0.1',
	port: 3000,
	path: '/events/100',
	method: 'PUT',
	headers: {
		'Content-Type': 'application/json'
	}
};

const updateData = JSON.stringify({
	'id': 100,
	'topics': 'updated_topic',
	'thumbnail': '/img/tr-3.jpeg',
	'url': 'index.html',
	'overrideURL': '',
	'linkType': '',
	'title': 'Created by Postman',
	'summary': 'Lorem ipsum dolor sit amet'
});

describe("test system consistency for edge-cases", function() {
	before(function() {
		http.get("http://localhost:3000/events", function(response) {
			let bodyResult = '';
			response.on('data', (chunk) => {
				bodyResult += chunk;
			});

			response.on("end", function() {
				bodyResult = JSON.parse(bodyResult);
				total_lines = bodyResult.length;
			});
		});
	});

	describe("test GET", function() {
		before(function() {
			http.get("http://localhost:3000/events/100", function(response) {});
		});

		it("get for id that doesn't exist", function(done) {
			http.get("http://localhost:3000/events", function(response) {
				assert.equal(response.statusCode, 200);
				let bodyResult = '';
				response.on('data', (chunk) => {
					bodyResult += chunk;
				});

				response.on("end", function() {
					bodyResult = JSON.parse(bodyResult);
					assert.equal(bodyResult.length, total_lines);
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

		it("delete for id that does'n exist", function(done) {
			http.get("http://localhost:3000/events", function(response) {
				assert.equal(response.statusCode, 200);
				let bodyResult = '';
				response.on('data', (chunk) => {
					bodyResult += chunk;
				});

				response.on("end", function() {
					bodyResult = JSON.parse(bodyResult);
					assert.equal(bodyResult.length, total_lines);
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
	
		it("update event id that doesn't exist", function(done) {
			http.get("http://localhost:3000/events", function(response) {
				assert.equal(response.statusCode, 200);
				let bodyResult = '';
				response.on('data', (chunk) => {
					bodyResult += chunk;
				});

				response.on("end", function() {
					bodyResult = JSON.parse(bodyResult);
					assert.equal(bodyResult.length, total_lines);
					done();
				});
			});
		});
	});
});