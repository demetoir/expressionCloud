import { assert } from 'chai';
import { Connection, QueryFailedError, Repository } from 'typeorm';
import { expectShouldNotCallThis } from 'test/lib/helper/jestHelper';
import { getConnectionForTest } from 'test/database/test-typeorm';
import { ExpressionSetting } from './expression.setting';

const database = 'expression_setting_entity';
describe('ExpressionSetting entity', () => {
	let expressionSettingRepository: Repository<ExpressionSetting>;
	let connection: Connection;

	beforeAll(async () => {
		connection = await getConnectionForTest(database);

		expressionSettingRepository = connection.getRepository(
			ExpressionSetting,
		);
	});

	afterAll(async () => {
		await connection.close();
	});

	it('should able to get repository from connection manager', () => {
		assert.isNotNull(expressionSettingRepository);
	});

	it('should create new entity', async () => {
		const setting = new ExpressionSetting();
		await connection.manager.save(setting);

		const result = await expressionSettingRepository.findOne({
			id: setting.id,
		});

		assert.isNotNull(result);
	});

	describe('column type check', () => {
		it('should not null at isPublic', async () => {
			try {
				const setting = new ExpressionSetting();
				setting.isLocked = false;
				setting.isPublic = null;

				await connection.manager.save(setting);

				expectShouldNotCallThis();
			} catch (e) {
				expect(e).toBeInstanceOf(QueryFailedError);
				expect(e.message).toBe("Column 'is_public' cannot be null");
			}
		});

		it('should not null at isLocked', async () => {
			try {
				const setting = new ExpressionSetting();
				setting.isLocked = null;
				setting.isPublic = false;

				await connection.manager.save(setting);
			} catch (e) {
				expect(e).toBeInstanceOf(QueryFailedError);
				expect(e.message).toBe("Column 'is_locked' cannot be null");
			}
		});
	});

	// describe('relation', () => {
	// 	let expressionSetting;
	//
	// 	it('should prepare projectSetting', async () => {
	// 		expressionSetting = new ExpressionSettingEntity();
	//
	// 		expressionSetting.name = 'setting';
	//
	// 		await connection.manager.save(expressionSetting);
	// 	});
	//
	// 	it('should relate with expression entity', async () => {
	// 		const expression = ExpressionFactory.build();
	// 		await connection.manager.save(expression);
	//
	// 		expression.setting = expressionSetting;
	// 		await connection.manager.save(expression);
	//
	// 		expressionSetting.expression = expression;
	// 		await connection.manager.save(expression);
	//
	// 		const result = await expressionSettingRepository.findOne({
	// 			where: { id: expressionSetting.id },
	// 			relations: ['expression'],
	// 		});
	//
	// 		assert.equal(result.expression.id, expression.id);
	// 	});
	// });
});
