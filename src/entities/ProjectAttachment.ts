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

    @Column({ type: 'int', unsigned: true }) // 0-开题报告, 1-结题报告
    type: number;

    @ManyToOne(() => Project, (project) => project.projectAttachments)
    @JoinColumn([{ name: 'projectId', referencedColumnName: 'id' }])
    projectId: number;
}
