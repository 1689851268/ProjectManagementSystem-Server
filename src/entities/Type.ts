import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './Project';

@Entity()
export class Type {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('varchar', { length: 10 })
    name: string;

    @OneToMany(() => Project, (project) => project.type)
    projects: Project[];
}
