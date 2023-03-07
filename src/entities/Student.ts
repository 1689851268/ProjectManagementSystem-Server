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
import { College } from './College';
import { Identity } from './Identity';
import { Project } from './Project';

@Index('StudentForCollege', ['college'], {})
@Index('StudentForIdentity', ['identity'], {})
@Entity()
export class Student {
    @PrimaryGeneratedColumn({
        type: 'int',
        comment: '学生账号（学号）',
    })
    id: number;

    @Column('varchar', { comment: '账号密码', length: 20 })
    password: string;

    @Column('varchar', { comment: '学生姓名', length: 30 })
    name: string;

    @Column('datetime', { comment: '注册时间' })
    registrationTime: Date;

    @Column('varchar', { comment: '所属专业', length: 10 })
    major: string;

    @Column('tinyint', { comment: '所属班级' })
    class: number;

    @Column('varchar', { nullable: true, length: 20 })
    email: string | null;

    @Column('varchar', { nullable: true, length: 11 })
    phone: string | null;

    @ManyToOne(() => College, (college) => college.students)
    @JoinColumn([{ name: 'college', referencedColumnName: 'id' }])
    college: College;

    @ManyToOne(() => Identity, (identity) => identity.students)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: Identity;

    @ManyToMany(() => Project, (project) => project.students)
    @JoinTable({ name: 'ProjectAndStudent' })
    projects: Project[];
}
