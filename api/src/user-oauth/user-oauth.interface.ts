import { IBaseEntity } from 'src/common/model/entity/base/base.interface';
import { IUser } from 'src/user/user.interface';

export interface IOauth extends IBaseEntity {
	type: number;

	authId: string;

	user: IUser;
}