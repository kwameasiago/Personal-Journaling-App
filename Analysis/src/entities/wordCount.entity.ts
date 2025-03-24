import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne,OneToMany, JoinColumn, Timestamp } from "typeorm";
import { Journals } from "./journal.entity";
import { serviceEvent } from "./serviceEvent.entity";

@Entity('wordCount')
export class WordCount{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'jsonb', nullable: false })
    word_cloud: Record<string, any>

    @CreateDateColumn()
    created_at: Timestamp

    @UpdateDateColumn()
    updated_at: Timestamp

    @OneToOne(() => Journals, (journals) => journals.wordCount, {onDelete:'CASCADE'})
    @JoinColumn({name: 'journal_id'})
    journals: Journals

    @ManyToOne(() => serviceEvent, event => event.word, {onDelete: 'CASCADE'})
    event: serviceEvent
}