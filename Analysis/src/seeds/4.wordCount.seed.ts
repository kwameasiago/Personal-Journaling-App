import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Tags } from "src/entities/tags.entity";
import { Journals } from "src/entities/journal.entity";
import { WordCount } from "src/entities/wordCount.entity";
import { serviceEvent } from "src/entities/serviceEvent.entity";


export default class CreateWordCount implements Seeder{
    public async run(factory: Factory, connection: Connection): Promise<any>{
        const journalsRepository = connection.getRepository(Journals)
        const journal = await journalsRepository.findOne({where: {title: 'test'}})
        const eventRepository = await connection.getRepository(serviceEvent)
        const event = await eventRepository.findOne({where: {type: 'create_journal'}})
        await connection.getRepository(WordCount).save([
            {
                word_cloud: {
                    hello: 5,
                    world: 3,
                    sample: 10
                },
                journal,
                events: event
            }

        ])
    }
}