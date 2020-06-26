const http = require('http');
const assert = require('assert');
let total_lines = 0;

const options = {
	hostname: '127.0.0.1',
	port: 3000,
	path: '/events',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	}
};

const options_del2 = {
	hostname: '127.0.0.1',
	port: 3000,
	path: '/events/2',
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
	"id": "2",
	"topics": "updated_topic",
	"thumbnail": "/img/tr-3.jpeg",
	"url": "index.html",
	"overrideURL": "",
	"linkType": "",
	"title": "Created by Postman",
	"summary": "Lorem ipsum dolor sit amet"
});

async function update() {
	const req = http.request(options_update, (res) => {
		res.setEncoding('utf8');
	});
	req.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});
	req.write(updateData);
	req.end();
}

async function delete_event() {
	const req = http.request(options_del2, (res) => {
		res.setEncoding('utf8');
	});

	req.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});
	req.end();
}

describe("TEST SYSTEM FLOW", function() {
	before(async function() {
		return update().then(function() {
			return delete_event();
		});
	});

	it("update -> stergere -> vizualizare", function(done) {
		http.get("http://localhost:3000/events", function(response) {
			assert.equal(response.statusCode, 200);
			let bodyResult = '';
			response.on('data', (chunk) => {
				bodyResult += chunk;
			});

			response.on("end", function() {
				bodyResult = JSON.parse(bodyResult);
				assert.equal(bodyResult.length, 11);
				done();
			});
		});
	});

    // post back the deleted event
	after(function() {
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
});