import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Identity } from './Identity';
import { v4 as uuid } from 'uuid';

@Index('RootForIdentity', ['identity'], {})
@Entity()
export class Root {
    @BeforeInsert()
    setId() {
        this.uuid = uuid().slice(0, 8); // 生成长度为 8 的 UUID
    }

    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 8 })
    uuid: string;

    @Column('varchar', { length: 20 })
    password: string;

    @ManyToOne(() => Identity, (identity) => identity.roots)
    @JoinColumn([{ name: 'identity', referencedColumnName: 'id' }])
    identity: Identity;
}
