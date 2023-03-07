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
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from './Status';
import { Type } from './Type';
import { ProjectAttachment } from './ProjectAttachment';
import { Specialist } from './Specialist';
import { Student } from './Student';
import { Teacher } from './Teacher';

@Index('ProjectForStatus', ['status'], {})
@Index('ProjectForType', ['type'], {})
@Entity()
export class Project {
    @PrimaryGeneratedColumn({ type: 'int', comment: '项目Id' })
    id: number;

    @Column('varchar', { comment: '项目名称', length: 20 })
    name: string;

    @Column('date', { comment: '申报时间' })
    applicationDate: string;

    @OneToOne(() => Student)
    @JoinColumn({ name: 'projectLeader' })
    projectLeader: Student;

    @OneToMany(
        () => ProjectAttachment,
        (projectAttachment) => projectAttachment.projectId,
    )
    projectAttachments: ProjectAttachment[];

    @ManyToOne(() => Type, (type) => type.projects)
    @JoinColumn([{ name: 'type', referencedColumnName: 'id' }])
    type: Type;

    @ManyToOne(() => Status, (status) => status.projects)
    @JoinColumn([{ name: 'status', referencedColumnName: 'id' }])
    status: Status;

    @ManyToMany(() => Specialist, (specialist) => specialist.projects)
    @JoinTable({ name: 'ProjectAndSpecialist' })
    specialists: Specialist[];

    @ManyToMany(() => Student, (student) => student.projects)
    @JoinTable({ name: 'ProjectAndStudent' })
    students: Student[];

    @ManyToMany(() => Teacher, (teacher) => teacher.projects)
    @JoinTable({ name: 'ProjectAndTeacher' })
    teachers: Teacher[];
}
