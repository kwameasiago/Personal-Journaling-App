import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Tags } from "src/entities/tags.entity";
import { Journals } from "src/entities/journal.entity";

export default class CreateTags implements Seeder{
    public async run(factory: Factory, connection: Connection):Promise<any>{
        const journalsRepository = connection.getRepository(Journals)
        const journal = await journalsRepository.findOne({where: {title: 'test'}})
        
        const savedTags = await connection.getRepository(Tags).save([
            {
                name: 'school',
                journal: journal
            }
        ])
    }
}