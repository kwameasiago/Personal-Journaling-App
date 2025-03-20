import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Timestamp } from "typeorm";
import { Journal } from "./journals.entity";

@Entity('tags')
export class Tags{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @CreateDateColumn()
    created_at: Timestamp

    @UpdateDateColumn()
    updated_at: Timestamp

    @ManyToOne(() => Journal, (journal) => journal.tags, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'journal_id'})
    journal: Journal


}