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
import { ProjectStatus } from './ProjectStatus';
import { ProjectType } from './ProjectType';
import { ProjectAttachment } from './ProjectAttachment';
import { Specialist } from './Specialist';
import { Student } from './Student';
import { Teacher } from './Teacher';
import { ProjectAchievement } from './ProjectAchievement';

@Index('ProjectForStatus', ['status'], {})
@Index('ProjectForType', ['type'], {})
@Entity()
export class Project {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 20 })
    name: string;

    @Column('varchar', { length: 13, comment: '发布时间' })
    publishTime: string;

    @Column('varchar', { length: 13, comment: '申报时间' })
    applicationDate: string; // 可以为空字符串, 表示该项目尚未被申报

    @ManyToOne(() => Student, (student) => student.mainProjects)
    @JoinColumn({ name: 'projectLeader', referencedColumnName: 'id' })
    projectLeader: number; // 可以为 0, 表示没有项目负责人

    @ManyToOne(() => ProjectType, (projectType) => projectType.projects)
    @JoinColumn([{ name: 'type', referencedColumnName: 'id' }])
    type: number;

    @ManyToOne(() => Teacher, (teacher) => teacher.projects)
    @JoinColumn([{ name: 'teacher', referencedColumnName: 'id' }])
    teacher: number;

    @ManyToOne(() => Specialist, (specialist) => specialist.projects)
    @JoinColumn([{ name: 'specialist', referencedColumnName: 'id' }])
    specialist: number; // 可以为 0, 表示没有专家审批

    @ManyToOne(() => ProjectStatus, (projectStatus) => projectStatus.projects)
    @JoinColumn([{ name: 'status', referencedColumnName: 'id' }])
    status: number;

    @ManyToMany(() => Student, (student) => student.projects)
    @JoinTable({ name: 'project_and_student' })
    students: number[];

    @OneToMany(
        () => ProjectAttachment,
        (projectAttachment) => projectAttachment.projectId,
    )
    projectAttachments: ProjectAttachment[];

    @OneToMany(
        () => ProjectAchievement,
        (projectAchievement) => projectAchievement.projectId,
    )
    projectAchievement: ProjectAchievement[];
}
