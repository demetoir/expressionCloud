import { IBaseEntity } from '../common/model/entity/base/base.interface';
import { IExpressionThumbnailImage } from '../expression/expression-thumbnail-image/expression-thumbnail-image.interface';
import { IUserProfileImage } from '../user/user-profile-image/user-profile-image.interface';

export interface IImage extends IBaseEntity {
	url: string;

	extension: string;

	path: string;

	type: number;

	fileName: string;

	expressionThumbnail: IExpressionThumbnailImage;

	userProfile: IUserProfileImage;
}