import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'credentials' })
export class Credential extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	account_name: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	mid: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	key: string;

	@Column({
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	created_on: Date;
}
