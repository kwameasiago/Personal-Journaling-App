import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Timestamp } from "typeorm";

@Entity('serviceEvent')
export class serviceEvent{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    tracking_key: number

    @CreateDateColumn()
    created_at: Timestamp

    @UpdateDateColumn()
    updated_ad: Timestamp
}