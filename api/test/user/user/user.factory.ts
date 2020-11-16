import { UserEntity } from 'src/user/model/user.entity';
import { IUser } from 'src/user/user.interface';
import { internet, lorem, name, random } from 'faker';

export class UserFactory {
	static build(): IUser {
		const user = new UserEntity();
		user.name = name.findName();
		user.email = internet.email() + random.number(10000000);
		user.description = lorem.sentence();

		return user;
	}
}
