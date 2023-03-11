import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Identity } from './Identity';
import { Project } from './Project';

@Index('SpecialistForIdentity', ['identity'], {})
@Entity()
export class Specialist {
    @PrimaryGeneratedColumn({ type: 'int', zerofill: true, unsigned: true })
    id: number;

    @Column('varchar', { length: 20 })
    password: string;

    @Column('varchar', { length: 30 })
    name: string;

    @Column('varchar', { nullable: true, length: 20 })
    email: string | null;

    @Column('varchar', { nullable: true, length: 11 })
    phone: string | null;

    @ManyToOne(() => Identity, (identity) => identity.specialists)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: Identity;

    @OneToMany(() => Project, (project) => project.specialist)
    projects: Project[];
}
