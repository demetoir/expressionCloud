import { assert } from 'chai';
import { UserOauth } from 'src/core/user/model/user-oauth';
import { getConnectionForTest } from 'test/database/test-typeorm';
import { Connection, Repository } from 'typeorm';

const database = 'user_oauth_entity';
describe('user oauth entity', () => {
	let connection: Connection;
	let oauthRepository: Repository<UserOauth>;

	beforeAll(async () => {
		connection = await getConnectionForTest(database);

		oauthRepository = connection.getRepository(UserOauth);
	});

	afterAll(async () => {
		await connection.close();
	});

	it('should able to get repository from connection manager', () => {
		assert.isNotNull(oauthRepository);
	});

	it('should create new project', async () => {
		const oauth = new UserOauth();
		oauth.authId = 'id';

		await connection.manager.save(oauth);

		const newEntity = await oauthRepository.findOne({ id: oauth.id });

		assert.equal(newEntity.id, oauth.id);
	});

	// describe('relation', () => {
	// 	let oauth;
	//
	// 	it('should prepare entity', async () => {
	// 		oauth = new UserOauthEntity();
	// 		oauth.type = 1;
	// 		oauth.authId = 'id';
	//
	// 		await connection.manager.save(oauth);
	// 	});
	//
	// 	it('should relate with user entity', async () => {
	// 		const user = UserFactory.build();
	// 		await connection.manager.save(user);
	//
	// 		user.oauth = oauth;
	// 		await connection.manager.save(user);
	//
	// 		oauth.user = user;
	// 		await connection.manager.save(oauth);
	//
	// 		const resultProject = await oauthRepository.findOne({
	// 			where: { id: oauth.id },
	// 			relations: ['user'],
	// 		});
	//
	// 		assert.equal(resultProject.user.id, user.id);
	// 	});
	// });
});
