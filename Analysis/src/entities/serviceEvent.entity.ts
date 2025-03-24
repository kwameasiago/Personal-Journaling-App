import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Timestamp, OneToOne } from "typeorm";
import { Journals } from "./journal.entity";
import { Tags } from "./tags.entity";
import { WordCount } from "./wordCount.entity";

@Entity('serviceEvent')
export class serviceEvent{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @CreateDateColumn()
    created_at: Timestamp

    @UpdateDateColumn()
    updated_at: Timestamp

    @OneToOne(() => Journals, journal => journal.event, {onDelete: 'CASCADE'} )
    journal: Journals

    @OneToMany(() => Tags, tag => tag.event, {onDelete: 'CASCADE'})
    tag: Tags

    @OneToMany(() => WordCount, word => word.event, {onDelete: 'CASCADE'})
    word: WordCount[]
}
