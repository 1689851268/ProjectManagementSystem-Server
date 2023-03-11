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
import { College } from './College';
import { Identity } from './Identity';
import { Major } from './Major';
import { Project } from './Project';

@Index('StudentForCollege', ['college'], {})
@Index('StudentForIdentity', ['identity'], {})
@Entity()
export class Student {
    @PrimaryGeneratedColumn({ type: 'int', zerofill: true, unsigned: true })
    id: number;

    @Column('varchar', { length: 20 })
    password: string;

    @Column('varchar', { length: 30 })
    name: string;

    @Column('datetime', { comment: '注册时间' })
    registrationTime: Date;

    @Column('tinyint', { comment: '所属班级' })
    class: number;

    @Column('varchar', { nullable: true, length: 20 })
    email: string | null;

    @Column('varchar', { nullable: true, length: 11 })
    phone: string | null;

    @ManyToOne(() => Major, (major) => major.students)
    @JoinColumn([{ name: 'major', referencedColumnName: 'id' }])
    major: Major;

    @ManyToOne(() => College, (college) => college.students)
    @JoinColumn([{ name: 'college', referencedColumnName: 'id' }])
    college: College;

    @ManyToOne(() => Identity, (identity) => identity.students)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: Identity;

    @ManyToMany(() => Project, (project) => project.students)
    @JoinTable({ name: 'project_and_student' })
    projects: Project[];

    @OneToMany(() => Project, (project) => project.projectLeader)
    mainProjects: Project[];
}
