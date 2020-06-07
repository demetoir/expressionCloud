import {
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_settings' })
export class UserSettingEntity {
	@PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id' })
	id: bigint;

	@CreateDateColumn({ type: 'datetime', name: 'created_at', nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ type: 'datetime', name: 'updated_at', nullable: false })
	updatedAt: Date;

	@DeleteDateColumn({
		type: 'datetime',
		name: 'deleted_at',
		nullable: true,
	})
	deletedAt: Date;

	@OneToOne(
		type => UserEntity,
		user => user.setting,
	)
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user: Promise<UserEntity>;
}
