import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Timestamp } from "typeorm";
import { Journals } from "./journal.entity";
@Entity('tags')
export class Tags{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @CreateDateColumn()
    created_at: Timestamp

    @UpdateDateColumn()
    updated_ad: Timestamp

    @ManyToOne(() => Journals, (journals) => journals.tags, {onDelete: 'CASCADE'})
    journals: Journals
}