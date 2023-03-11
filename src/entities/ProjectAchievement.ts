/* GET */
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AchievementType } from './AchievementType';
import { Project } from './Project';

@Index('AttachmentForProject', ['projectId'], {})
@Entity()
export class ProjectAchievement {
    @PrimaryGeneratedColumn({ type: 'int', zerofill: true, unsigned: true })
    id: number;

    @Column('varchar', { length: 20 })
    name: string;

    @Column('varchar', { length: 100 })
    storagePath: string;

    @ManyToOne(() => Project, (project) => project.projectAttachments)
    @JoinColumn([{ name: 'projectId', referencedColumnName: 'id' }])
    projectId: Project;

    @ManyToOne(
        () => AchievementType,
        (achievementType) => achievementType.projects,
    )
    @JoinColumn([{ name: 'type', referencedColumnName: 'id' }])
    type: AchievementType;
}
