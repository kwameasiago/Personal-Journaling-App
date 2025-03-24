import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Timestamp } from "typeorm";
import { Tags } from "./tags.entity";

@Entity('journals')
export class Journal{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    title: string

    @Column()
    content: string

    @CreateDateColumn()
    created_at: Timestamp

    @UpdateDateColumn()
    updated_at: Timestamp

    @OneToMany(() => Tags, (tags) => tags.journal, {onDelete: 'CASCADE'})
    tags: Tags
}