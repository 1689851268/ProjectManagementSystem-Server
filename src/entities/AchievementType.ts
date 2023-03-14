import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectAchievement } from './ProjectAchievement';

@Entity()
export class AchievementType {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 10 })
    name: string;

    @OneToMany(
        () => ProjectAchievement,
        (projectAchievement) => projectAchievement.type,
    )
    projects: ProjectAchievement[];
}
