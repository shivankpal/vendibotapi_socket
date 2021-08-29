import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MachineItemsStatus, MachineType } from '../items/common.enum';

@Entity({ name: 'machines' })
export class Machines extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    machine_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    address: string;

    @Column({ type: 'double',  default: 0 })
    lat: number;

    @Column({ type: 'double', default: 0 })
    lng: number;

    @Column({
        type: 'enum',
        enum: MachineType,
        default: MachineType.BEVARAGES,
    })
    type: MachineType;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
    })
    created_on: Date;
}
