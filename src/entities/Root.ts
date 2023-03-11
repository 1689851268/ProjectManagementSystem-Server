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
    @PrimaryGeneratedColumn({ type: 'int', zerofill: true, unsigned: true })
    id: number;

    @Column('varchar', { length: 20 })
    password: string;

    @ManyToOne(() => Identity, (identity) => identity.roots)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: Identity;
}
