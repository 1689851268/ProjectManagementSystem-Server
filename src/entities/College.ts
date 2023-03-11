import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../entities/Student';
import { Teacher } from '../entities/Teacher';
import { Major } from './Major';

@Entity()
export class College {
    @PrimaryGeneratedColumn({ type: 'int', zerofill: true, unsigned: true })
    id: number;

    @Column('varchar', { length: 10 })
    name: string;

    @OneToMany(() => Student, (student) => student.college)
    students: Student[];

    @OneToMany(() => Teacher, (teacher) => teacher.college)
    teachers: Teacher[];

    @OneToMany(() => Major, (major) => major.college)
    majors: Major[];
}
