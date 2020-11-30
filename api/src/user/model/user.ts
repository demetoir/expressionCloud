import { Entity, OneToOne } from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
	BooleanColumn,
	CreatedAtColumn,
	DeletedAtColumn,
	IdColumn,
	IntColumn,
	TextColumn,
	UpdatedAtColumn,
	VarcharColumn,
} from 'src/common/typeorm';
import {
	BooleanField,
	DateTimeField,
	IdField,
	IntField,
	StringField,
} from 'src/common/graphql';
import { UserSetting } from 'src/user-setting';

export const GQL_INPUT_TYPE_USER = 'UserInput';
export const GQL_OBJECT_TYPE_USER = 'User';

@InputType(GQL_INPUT_TYPE_USER)
@ObjectType(GQL_OBJECT_TYPE_USER)
@Entity({ name: 'user' })
export class User {
	@IdField()
	@IdColumn()
	id: number;

	@DateTimeField()
	@CreatedAtColumn()
	createdAt: Date;

	@DateTimeField()
	@UpdatedAtColumn()
	updatedAt: Date;

	@DateTimeField({ nullable: true })
	@DeletedAtColumn()
	deletedAt: Date;

	@StringField()
	@VarcharColumn({
		name: 'name',
		length: 255,
	})
	name: string;

	@StringField()
	@VarcharColumn({
		name: 'email',
		length: 255,
		nullable: true,
		default: null,
		unique: true,
	})
	email?: string;

	@StringField()
	@TextColumn({
		name: 'description',
		nullable: true,
		default: null,
	})
	description?: string;

	@BooleanField()
	@BooleanColumn({
		name: 'is_anonymous',
		default: false,
	})
	isAnonymous: boolean;

	@IntField()
	@IntColumn({
		name: 'liked_count',
		default: 0,
	})
	likedCount: number;

	@IntField()
	@IntColumn({
		name: 'forked_count',
		default: 0,
	})
	forkedCount: number;

	// relation
	@Field(() => UserSetting)
	@OneToOne(() => UserSetting, (setting) => setting.user)
	setting: Promise<UserSetting>;
}
