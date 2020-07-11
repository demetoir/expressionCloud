import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class drop_column_ret_type_in_images_table_1591519993000
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn(
			'images',
			new TableColumn({
				name: 'ret_type',
				type: 'bigint',
				isNullable: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'images',
			new TableColumn({
				name: 'ret_type',
				type: 'bigint',
				isNullable: true,
			}),
		);
	}
}