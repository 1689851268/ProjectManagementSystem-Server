/* GET */
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './Project';

@Index('AttachmentForProject', ['projectId'], {})
@Entity()
export class ProjectAttachment {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 20 })
    name: string;

    @Column('varchar', { length: 100 })
    storagePath: string;

    @ManyToOne(() => Project, (project) => project.projectAttachments)
    @JoinColumn([{ name: 'projectId', referencedColumnName: 'id' }])
    projectId: Project;
}
