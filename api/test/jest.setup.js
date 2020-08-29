const { createConnection } = require('typeorm');
const { ormConfig } = require('../src/common/model/configLoader');
const _ = require('lodash');

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async () => {
	let connection;
	const MAX_RETRY = 5;

	for await (let i of _.range(0, MAX_RETRY)) {
		try {
			connection = await createConnection({
				...ormConfig,
				dropSchema: true,
			});

			break;
		} catch (e) {
			console.log(`can not connect to db retry ${i}`);
		}

		console.log(`sleep wait for db ${2000}ms`);
		await sleep(2000);
	}

	if (!connection) {
		throw new Error(
			'can not connection to db, even if retry for MAX_RETRY',
		);
	}

	await connection.synchronize();

	global.connection = connection;
};
