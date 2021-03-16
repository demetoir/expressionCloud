import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GQLContext } from 'src/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleName } from '../role';
import { TokenPayload } from '../token';
import { METADATA_KEY_ROLES } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoleNames = this.reflector.getAllAndOverride<RoleName[]>(
			METADATA_KEY_ROLES,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRoleNames) {
			return true;
		}

		const ctx = GqlExecutionContext.create(context);
		const { req }: GQLContext = ctx.getContext();
		const user = req.user as TokenPayload<any>;

		const userRoleNames = user.roles.map((x) => x.name);

		return requiredRoleNames.some((requireRoleName) =>
			userRoleNames.some(
				(userRoleName) => userRoleName === requireRoleName,
			),
		);
	}
}