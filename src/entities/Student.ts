import {
    BeforeInsert,
    Column,
    CreateDateColumn,
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

    @CreateDateColumn({ comment: '注册时间' })
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
