import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Role } from "./roles.entity";
import { Session } from "./session.entity";
import { Logs } from "./logs.entity";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Role, (role) => role.user, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'role_id'})
    role: Role;

    @OneToMany(() => Session, (session) => session.user, {onDelete: 'CASCADE'})
    session: Session;

    @OneToMany(() => Logs, (logs) => logs.user, {onDelete: 'CASCADE'})
    logs: Logs
}

