/* Get */
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Specialist } from './Specialist';

@Entity()
export class Group {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('varchar', { length: 10 })
    name: string;

    @ManyToMany(() => Specialist, (specialist) => specialist.groups)
    @JoinTable({ name: 'GroupAndSpecialist' })
    specialists: Specialist[];
}
