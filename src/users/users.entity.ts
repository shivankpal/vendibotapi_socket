import { AccountType } from './users.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'users' })
@Unique('UQ_USER', ['username'])
export class UsersEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	username: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	password: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	name: string;

	@Column({
		type: 'enum',
		enum: AccountType,
		default: AccountType.ADMIN
	})
	type: AccountType

	@Column({
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	created_on: Date;
}
