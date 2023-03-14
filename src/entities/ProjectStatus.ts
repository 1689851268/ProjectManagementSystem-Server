import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './Project';

@Entity()
export class ProjectStatus {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 10 })
    name: string;

    @OneToMany(() => Project, (project) => project.status)
    projects: Project[];
}
