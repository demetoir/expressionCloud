import { ResponseObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { Type } from '@nestjs/common';

export interface ApiCRUDOption extends Omit<ResponseObject, 'description'> {
	// status?: number | 'default';
	// eslint-disable-next-line @typescript-eslint/ban-types
	type?: Type<unknown> | Function | [Function] | string;
	name?: string;
	isArray?: boolean;
	description?: string;
}

export declare type ApiCRUDDecorator = MethodDecorator & ClassDecorator;