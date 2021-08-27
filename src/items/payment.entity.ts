import { TransactionStatus, TransactionType } from './common.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payment' })
export class Payment extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	order_id: string;

	@Column({ type: 'int', default: 0, nullable: false })
	machine_id: number;

	@Column({ type: 'int', default: 0, nullable: false })
	item_id: number;

	@Column({ type: 'float', default: 0, nullable: false })
	price: number;

	@Column({ type: 'longtext', default: null, nullable: true })
	request: string;

	@Column({ type: 'longtext', default: null, nullable: true })
	response: string;

	@Column({
		type: 'enum',
		enum: TransactionStatus,
		default: TransactionStatus.PENDING
	})
	status: TransactionStatus;

	@Column({
		type: 'enum',
		enum: TransactionType,
		default: TransactionType.ONLINE
	})
	type: TransactionType

	@Column({
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	created_on: Date;
}
