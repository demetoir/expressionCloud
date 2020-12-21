import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/model/entity/base/base.entity';

@Entity({ name: 'scalars' })
export class ScalarEntity extends BaseEntity {
	// todo 이거 정밀도 때문에 문제 발생가능성 있으니 테코 만들기, string 으로 바꾸든 어떻게든 해야한
	// todo 이거랑 연관된 테이블인 edit history 테이블의 값도 변경하기
	@Column({ name: 'value', type: 'double precision', nullable: false })
	value: number;

	@Column({ name: 'index', type: 'int', nullable: false })
	index: number;

	// @ManyToOne(() => Vector, (vector) => vector.scalars)
	// @JoinColumn({ name: 'column_id', referencedColumnName: 'id' })
	// vector: Vector;
}
