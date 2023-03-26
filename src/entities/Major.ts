import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { College } from './College';
import { Student } from './Student';

@Entity()
export class Major {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 10 })
    name: string;

    @OneToMany(() => Student, (student) => student.major)
    students: Student[];

    @ManyToOne(() => College, (college) => college.majors)
    @JoinColumn([{ name: 'college', referencedColumnName: 'id' }])
    college: number;
}
