import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('roles')
export class Role{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string

    @Column()
    description: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => User, (user) => user.role, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'role_id'})
    user: User
}
