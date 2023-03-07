import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './Notification';
import { College } from './College';
import { Identity } from './Identity';
import { Project } from './Project';

@Index('TeacherForCollege', ['college'], {})
@Index('TeacherForIdentity', ['identity'], {})
@Entity()
export class Teacher {
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

    @OneToMany(() => Notification, (notification) => notification.publisher)
    notifications: Notification[];

    @ManyToOne(() => College, (college) => college.teachers)
    @JoinColumn([{ name: 'college', referencedColumnName: 'id' }])
    college: College;

    @ManyToOne(() => Identity, (identity) => identity.teachers)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: Identity;

    @ManyToMany(() => Project, (project) => project.teachers)
    @JoinTable({ name: 'ProjectAndTeacher' })
    projects: Project[];
}
