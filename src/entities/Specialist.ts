import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Identity } from './Identity';
import { Group } from './Group';
import { Project } from './Project';

@Index('SpecialistForIdentity', ['identity'], {})
@Entity()
export class Specialist {
    @PrimaryGeneratedColumn({ type: 'int', comment: '账号' })
    id: number;

    @Column('varchar', { comment: '密码', length: 20 })
    password: string;

    @Column('varchar', { comment: '姓名', length: 30 })
    name: string;

    @Column('varchar', { nullable: true, length: 20 })
    email: string | null;

    @Column('varchar', { nullable: true, length: 11 })
    phone: string | null;

    @ManyToOne(() => Identity, (identity) => identity.specialists)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: Identity;

    @ManyToMany(() => Project, (project) => project.specialists)
    @JoinTable({ name: 'ProjectAndSpecialist' })
    projects: Project[];

    @ManyToMany(() => Group, (group) => group.specialists)
    @JoinTable({ name: 'GroupAndSpecialist' })
    groups: Group[];
}
