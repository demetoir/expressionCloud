import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_AUD, JWT_ISS, JWT_SECRET } from '../constants';
import { DoubleJwtService } from './double-jwt.service';
import { expectShouldNotCallThis } from '../../../test/lib/helper/jestHelper';
import {
	ExpiredJwtError,
	InvalidJwtPayloadError,
	InvalidJWTSignatureError,
	MalformedJWTError,
} from './error';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

import * as jwt from 'jsonwebtoken';
import { IJwtPayload } from './interface';

interface TestIJwtPayload extends IJwtPayload {
	userName: string;
	role: string;
}

describe('DoubleJWTService', () => {
	let service: DoubleJwtService<TestIJwtPayload>;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({
					secret: JWT_SECRET,
				}),
			],
			providers: [DoubleJwtService],
		}).compile();

		service = module.get(DoubleJwtService);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be DI', () => {
		expect(service).toBeDefined();
		expect(jwtService).toBeDefined();
	});

	it('should define method', function () {
		expect(service.verify).toBeDefined();
		expect(service.signAccessToken).toBeDefined();
		expect(service.signRefreshToken).toBeDefined();
	});

	describe('signAccessToken', function () {
		it('should sign access token with only required', async function () {
			// given
			const user: TestIJwtPayload = {
				role: 'user',
				userName: 'username',
				userId: 1,
			};

			// when
			const [token, tokenUuid] = await service.signAccessToken(user);

			//than able to verify
			const payload: TestIJwtPayload = await jwtService.verifyAsync(
				token,
			);

			// than expect payload property
			expect(payload.type).toEqual('accessToken');
			expect(payload.iss).toEqual(JWT_ISS);
			expect(payload.aud).toEqual(JWT_AUD);
			expect(payload.role).toEqual(user.role);
			expect(payload.userName).toEqual(user.userName);
			expect(payload.userId).toEqual(user.userId);
			expect(payload.uuid).toEqual(tokenUuid);

			// expect(uuidValidate(payload.uuid)).toBeTruthy();
			// expect(uuidVersion(payload.uuid)).toEqual(4);

			// than expect exact time from exp to issue
			const duration = 1;
			const time = duration * 60 * 60 * 1000;
			expect(payload.exp - payload.iat).toEqual(time);

			expect(tokenUuid).toBeDefined();
			expect(tokenUuid).toEqual(payload.uuid);
		});
	});

	describe('signAccessToken', function () {
		it('should sign refresh token', async function () {
			// given
			const user: TestIJwtPayload = {
				role: 'user',
				userName: 'username',
				userId: 1,
			};

			// when
			const [token, tokenUuid] = await service.signRefreshToken(user);

			//than able to verify
			const payload: TestIJwtPayload = await jwtService.verifyAsync(
				token,
			);

			// than expect payload property
			expect(payload.type).toEqual('refreshToken');
			expect(payload.iss).toEqual(JWT_ISS);
			expect(payload.aud).toEqual(JWT_AUD);
			expect(payload.role).toEqual(user.role);
			expect(payload.userName).toEqual(user.userName);
			expect(payload.userId).toEqual(user.userId);
			expect(payload.uuid).toEqual(tokenUuid);
			// than expect exact time from exp to issue

			const duration = 10;
			const time = duration * 60 * 60 * 1000;
			expect(payload.exp - payload.iat).toEqual(time);

			expect(tokenUuid).toBeDefined();
			expect(tokenUuid).toEqual(payload.uuid);
		});
	});

	describe('verify', function () {
		it('should verify', async function () {
			// given
			const user: TestIJwtPayload = {
				role: 'user',
				userName: 'username',
				userId: 1,
			};

			const [token, tokenUuid] = await service.signRefreshToken(user);

			// when
			const payload = await service.verify(token);

			// than
			expect(payload).toBeDefined();
			expect(payload.role).toBe(user.role);
			expect(payload.userName).toBe(user.userName);
			expect(payload.userId).toBe(user.userId);
			expect(tokenUuid).toBeDefined();
		});

		it('should raise error, if broken token', async function () {
			// given
			const brokenToken = '123124';

			try {
				// when
				await service.verify(brokenToken);

				expectShouldNotCallThis();
			} catch (e) {
				expect(e).toBeInstanceOf(MalformedJWTError);
			}
		});

		it('should raise error, if expired token', async function () {
			const duration = 10;

			const iat = moment()
				.add(-duration * 2, 'hour')
				.valueOf();
			const exp = moment().add(-duration, 'hour').valueOf();
			const tokenUuid = uuid();
			const payload: TestIJwtPayload = {
				sub: 'any',
				iss: JWT_ISS,
				aud: JWT_AUD,
				iat: iat,
				exp: exp,
				uuid: tokenUuid,
				type: 'refreshToken',
				userId: 1,
				userName: 'username',
				role: 'user',
			};

			const expiredToken = await jwt.sign(payload, JWT_SECRET);

			try {
				// when
				await service.verify(expiredToken);

				expectShouldNotCallThis();
			} catch (e) {
				expect(e).toBeInstanceOf(ExpiredJwtError);
			}
		});

		it('should raise error, if invalid signature', async function () {
			// given token with invalid signature
			const payload = {};

			const token = await jwt.sign(payload, '~12');

			try {
				// when
				await service.verify(token);

				expectShouldNotCallThis();
			} catch (e) {
				expect(e).toBeInstanceOf(InvalidJWTSignatureError);
			}
		});

		it('should raise error, if invalid type', async function () {
			// given token with invalid signature
			const duration = 10;
			const iat = moment().valueOf();
			const exp = moment().add(duration, 'hour').valueOf();
			const tokenUuid = uuid();
			const payload = {
				sub: 'any',
				iss: JWT_ISS,
				aud: JWT_AUD,
				iat: iat,
				exp: exp,
				uuid: tokenUuid,
				type: 'in valid type',
			};

			const token = await jwt.sign(payload, JWT_SECRET);

			try {
				// when
				await service.verify(token);

				expectShouldNotCallThis();
			} catch (e) {
				expect(e).toBeInstanceOf(InvalidJwtPayloadError);
			}
		});
	});
});