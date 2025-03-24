import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Timestamp, OneToOne } from "typeorm";
import { Tags } from "./tags.entity";
import { WordCount } from "./wordCount.entity";
import { serviceEvent } from "./serviceEvent.entity";


@Entity('journals')
export class Journals{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ type: 'text', nullable: false })
    content: string

    @Column()
    user_id: number

    @Column()
    journal_id: number
    
    @Column()
    journal_length: number

    @Column()
    journal_created_at_date: Date

    @Column()
    journal_updated_at_date: Date

    @Column()
    time_of_day: string

    @CreateDateColumn()
    created_at: Timestamp

    @UpdateDateColumn()
    updated_at: Timestamp

    @OneToOne(() => serviceEvent, event => event.journal, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'event_id'})
    event: serviceEvent

    @OneToMany(() => Tags, (tags) => tags.journals, {onDelete: 'CASCADE'})
    tags: Tags

    @OneToOne(() => WordCount, (wordCount) => wordCount.journals, {onDelete:'CASCADE'})
    wordCount: WordCount
}