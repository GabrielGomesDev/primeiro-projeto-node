import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterUserEmailColumn1613401940739 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'e-mail');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: false
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.dropColumn('users', 'email');
    await queryRunner.addColumn('users', new TableColumn({
      name: 'e-mail',
      type: 'varchar'
    }));
  }

}
