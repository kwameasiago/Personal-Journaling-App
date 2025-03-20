import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Timestamp } from "typeorm";
import { Journals } from "./journal.entity";

@Entity('wordCount')
export class WordCount{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'jsonb', nullable: false })
    word_cloud: Record<string, any>

    @OneToMany(() => Journals, (journals) => journals.wordCount, {onDelete:'CASCADE'})
    journals: Journals
}