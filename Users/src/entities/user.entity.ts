import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from "typeorm";
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

    @Column()
    role_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => Role, (role) => role.user, {onDelete: 'CASCADE'})
    role: Role;

    @OneToMany(() => Session, (session) => session.user, {onDelete: 'CASCADE'})
    session: Session;

    @OneToMany(() => Logs, (logs) => logs.user, {onDelete: 'CASCADE'})
    logs: Logs
}

