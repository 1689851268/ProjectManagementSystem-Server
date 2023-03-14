import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Root } from './Root';
import { Specialist } from './Specialist';
import { Student } from './Student';
import { Teacher } from './Teacher';

@Entity()
export class Identity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 10 })
    name: string;

    @OneToMany(() => Root, (root) => root.identity)
    roots: Root[];

    @OneToMany(() => Specialist, (specialist) => specialist.identity)
    specialists: Specialist[];

    @OneToMany(() => Student, (student) => student.identity)
    students: Student[];

    @OneToMany(() => Teacher, (teacher) => teacher.identity)
    teachers: Teacher[];
}
