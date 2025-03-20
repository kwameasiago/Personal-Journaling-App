import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Timestamp } from "typeorm";
import { Tags } from "./tags.entity";
import { WordCount } from "./wordCount.entity";


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
    journal_data: Date

    @Column()
    time_of_day: string

    @CreateDateColumn()
    created_at: Timestamp

    @UpdateDateColumn()
    updated_ad: Timestamp

    @OneToMany(() => Tags, (tags) => tags.journals, {onDelete: 'CASCADE'})
    tags: Tags

    @OneToMany(() => WordCount, (wordCount) => wordCount.journals, {onDelete:'CASCADE'})
    wordCount: WordCount
}