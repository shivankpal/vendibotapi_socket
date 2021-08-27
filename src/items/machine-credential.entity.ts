import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'machine_credential' })
export class MachineCredential extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int', default: 0, nullable: false })
	credential_id: number;

	@Column({ type: 'int', default: 0, nullable: false })
	machine_id: number;

	@Column({
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	created_on: Date;
}
