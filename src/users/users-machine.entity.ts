import { AccountType } from './users.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'users_machine' })
@Unique('UQ_USER_MACHINE', ['user_id', 'machine_id'])
export class UsersMachine extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int', default: null, nullable: true })
	user_id: number;

	@Column({ type: 'int', default: null, nullable: true })
	machine_id: number;	

	@Column({
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	created_on: Date;
}
