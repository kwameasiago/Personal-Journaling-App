import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('logs')
export class Logs{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    actions: string;

    @Column()
    device: string;

    @Column()
    ip_address: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => User, (user) => user.logs, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User
}
