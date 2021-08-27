import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MachineItemsStatus } from './common.enum';

@Entity({ name: 'machine_items' })
export class MachineItems extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  item_id: number;

  @Column({ type: 'int', default: 0 })
  machine_id: number;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({
    type: 'enum',
    enum: MachineItemsStatus,
    default: MachineItemsStatus.ACTIVE,
  })
  status: MachineItemsStatus;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_on: Date;
}
