import {
    BeforeInsert,
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
import { v4 as uuid } from 'uuid';

@Index('StudentForCollege', ['college'], {})
@Index('StudentForIdentity', ['identity'], {})
@Entity()
export class Student {
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

    @Column('varchar', { length: 13, comment: '注册时间' })
    registrationTime: string; // 存储为字符串格式的时间戳

    @Column('tinyint', { comment: '所属班级' })
    class: number;

    @Column('varchar', { length: 30 })
    email: string; // 可以为空字符串

    @Column('varchar', { length: 11 })
    phone: string; // 可以为空字符串

    @ManyToOne(() => Major, (major) => major.students)
    @JoinColumn([{ name: 'major', referencedColumnName: 'id' }])
    major: number;

    @ManyToOne(() => College, (college) => college.students)
    @JoinColumn([{ name: 'college', referencedColumnName: 'id' }])
    college: number;

    @ManyToOne(() => Identity, (identity) => identity.students)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: number;

    @ManyToMany(() => Project, (project) => project.students)
    @JoinTable({ name: 'project_and_student' })
    projects: number[];

    @OneToMany(() => Project, (project) => project.projectLeader)
    mainProjects: number[];
}
