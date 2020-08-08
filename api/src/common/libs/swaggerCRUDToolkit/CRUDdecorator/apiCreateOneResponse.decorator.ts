import { applyDecorators } from '@nestjs/common';
import { ApiCRUDOption } from '../apiPropertyOption.interface';
import { ApiCreatedResponse } from '../responseDecorator/apiCreatedResoponse.decorator';
import { ApiUnauthorizedResponse } from '../responseDecorator/apiUnauthorizedResponse.decorator';
import { ApiForbiddenResponse } from '../responseDecorator/apiForbiddenReponse.decorator';

export function ApiCreateOneResponse(
	option: ApiCRUDOption,
): MethodDecorator & ClassDecorator {
	return applyDecorators(
		ApiCreatedResponse({
			type: option.type,
			isArray: false,
			description: 'success create',
		}),
		ApiUnauthorizedResponse(),
		ApiForbiddenResponse(),
	);
}
