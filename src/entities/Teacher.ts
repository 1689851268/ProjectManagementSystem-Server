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
import { Notification } from './Notification';
import { College } from './College';
import { Identity } from './Identity';
import { Project } from './Project';

import { v4 as uuid } from 'uuid';
@Index('TeacherForCollege', ['college'], {})
@Index('TeacherForIdentity', ['identity'], {})
@Entity()
export class Teacher {
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

    @ManyToOne(() => College, (college) => college.teachers)
    @JoinColumn([{ name: 'college', referencedColumnName: 'id' }])
    college: College;

    @ManyToOne(() => Identity, (identity) => identity.teachers)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: Identity;

    @OneToMany(() => Notification, (notification) => notification.publisher)
    newNotifications: Notification[];

    @OneToMany(() => Notification, (notification) => notification.lastUpdater)
    oldNotifications: Notification[];

    @OneToMany(() => Project, (project) => project.teacher)
    projects: Project[];
}
