/* GET */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../entities/Student';
import { Teacher } from '../entities/Teacher';

@Entity()
export class College {
    @PrimaryGeneratedColumn({ type: 'int', comment: '院校Id' })
    id: number;

    @Column('varchar', { comment: '院校名称', length: 10 })
    name: string;

    @OneToMany(() => Student, (student) => student.college)
    students: Student[];

    @OneToMany(() => Teacher, (teacher) => teacher.college)
    teachers: Teacher[];
}
