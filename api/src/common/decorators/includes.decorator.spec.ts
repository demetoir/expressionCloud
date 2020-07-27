import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { mock } from 'jest-mock-extended';
import { _Includes, Includes } from './includes.decorator';

function getExecutionContextMock(request): ExecutionContext {
	const httpArgumentHost = mock<HttpArgumentsHost>();
	// noinspection TypeScriptUnresolvedFunction
	httpArgumentHost.getRequest.mockReturnValue(request);

	const executionContext = mock<ExecutionContext>();

	executionContext.switchToHttp.mockReturnValue(httpArgumentHost);

	return executionContext;
}

describe('includes param decorator', () => {
	it('should be declare', function () {
		expect(Includes).toBeDefined();
		expect(_Includes).toBeDefined();
	});

	it('should be send args (data, ctx)', function () {
		const request = {
			query: {
				includes: '12,1231,23',
			},
		};

		const context = getExecutionContextMock(request);
		const result = _Includes(null, context);

		expect(result).toBeInstanceOf(Array);
	});

	it('should be return array type', function () {
		const request = {
			query: {
				includes: '12,1231,23',
			},
		};

		const context = getExecutionContextMock(request);
		const result = _Includes(null, context);

		expect(result).toBeInstanceOf(Array);
	});

	it('should be parse include', function () {
		const request = {
			query: {
				includes: 'a,b,c',
			},
		};

		const context = getExecutionContextMock(request);
		const result = _Includes(null, context);

		expect(result).toStrictEqual(['a', 'b', 'c']);
	});

	it('should be empty array if includes not in query', function () {
		const request = {
			query: {},
		};

		const context = getExecutionContextMock(request);
		const result = _Includes(null, context);

		expect(result).toStrictEqual([]);
	});

	it('should be ignore empty string', function () {
		const request = {
			query: { includes: '11,,,,5&&,' },
		};

		const context = getExecutionContextMock(request);
		const result = _Includes(null, context);

		expect(result).toStrictEqual(['11', '5&&']);
	});
});