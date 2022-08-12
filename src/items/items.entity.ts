import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
export class Items extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	title: string;

	@Column({ type: 'varchar', length: 10, default: null, nullable: true })
	code: string;

	@Column({ type: 'text', default: null, nullable: true })
	description: string;

	@Column({ type: 'text', default: null, nullable: true })
	image: string;

	@Column({ type: 'longtext', default: null, nullable: true })
	rawimage: string;

	@Column({
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	created_on: Date;
}
