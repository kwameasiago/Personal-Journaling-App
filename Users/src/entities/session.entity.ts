import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('session')
export class Session{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string

    @Column()
    device: string

    @Column()
    ip_address: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => User, (user) => user.session, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User
}
