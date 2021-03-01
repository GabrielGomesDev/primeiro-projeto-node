import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterUserCreateAt1613402218552 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'create_at');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'now()'
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.dropColumn('users', 'created_at');
    await queryRunner.addColumn('users', new TableColumn({
      name: 'create_at',
      type: 'timestamp',
      default: 'now()'
    }));
  }

}
