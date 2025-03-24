import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from 'typeorm';
import { Journals } from "src/entities/journal.entity";
import { serviceEvent } from "src/entities/serviceEvent.entity";
import * as fs from 'fs';
import * as path from 'path';

export default class CreateJournals implements Seeder{
    public async run(Factory: Factory,connections: Connection): Promise<any>{
        const eventRepository = await connections.getRepository(serviceEvent)
        const event = await eventRepository.findOne({where: {type: 'create_journal'}})
        const savedJournal = await connections.getRepository(Journals).save([{
            title: 'this is a test',
            content: 'bla bla bla',
            user_id: 1,
            events: event,
            journal_id: 1,
            journal_length: 10,
            journal_created_at_date: '2022-01-01',
            journal_updated_at_date: '2022-01-01',
            time_of_day: 'NIGHT'
        }])
    }
}