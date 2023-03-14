import {
    BeforeInsert,
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
import { v4 as uuid } from 'uuid';

@Index('SpecialistForIdentity', ['identity'], {})
@Entity()
export class Specialist {
    @BeforeInsert()
    setId() {
        this.uuid = uuid().slice(0, 8); // 生成长度为 8 的 UUID
    }

    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 8 })
    uuid: string;

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
