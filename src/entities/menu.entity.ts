import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Identity } from './Identity';

@Entity()
export class Menu {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ length: 10 })
    name: string;

    @Column({ length: 10 })
    path: string;

    @Column({ unsigned: true })
    order: number;

    @Column({ length: 30 })
    acl: string;

    // @ManyToMany(() => Identity, (identity) => identity.menus)
    // @JoinTable({ name: 'menus_and_identities' })
    // identities: number[];
}
