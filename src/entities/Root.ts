import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Identity } from './Identity';

@Index('RootForIdentity', ['identity'], {})
@Entity()
export class Root {
    @PrimaryGeneratedColumn({ type: 'int', comment: '账号' })
    id: number;

    @Column('varchar', { comment: '密码', length: 20 })
    password: string;

    @ManyToOne(() => Identity, (identity) => identity.roots)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: Identity;
}
