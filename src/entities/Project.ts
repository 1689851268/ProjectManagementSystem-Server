/* GET */
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
    @PrimaryGeneratedColumn({ type: 'int', zerofill: true, unsigned: true })
    id: number;

    @Column('varchar', { length: 20 })
    name: string;

    @Column('date', { comment: '申报时间' })
    applicationDate: string;

    @ManyToOne(() => Student, (student) => student.mainProjects)
    @JoinColumn({ name: 'projectLeader', referencedColumnName: 'id' })
    projectLeader: Student;

    @ManyToOne(() => ProjectType, (projectType) => projectType.projects)
    @JoinColumn([{ name: 'type', referencedColumnName: 'id' }])
    type: ProjectType;

    @ManyToOne(() => Teacher, (teacher) => teacher.projects)
    @JoinColumn([{ name: 'teacher', referencedColumnName: 'id' }])
    teacher: Teacher;

    @ManyToOne(() => Specialist, (specialist) => specialist.projects)
    @JoinColumn([{ name: 'specialist', referencedColumnName: 'id' }])
    specialist: Specialist;

    @ManyToOne(() => ProjectStatus, (projectStatus) => projectStatus.projects)
    @JoinColumn([{ name: 'status', referencedColumnName: 'id' }])
    status: ProjectStatus;

    @ManyToMany(() => Student, (student) => student.projects)
    @JoinTable({ name: 'project_and_student' })
    students: Student[];

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
