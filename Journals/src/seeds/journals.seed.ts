import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from 'typeorm';
import { Journal } from "src/entities/journals.entity";
import * as fs from 'fs';
import * as path from 'path';

export default class CreateJournals implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        // Save the journal entry to the database
        const savedJournals = await connection.getRepository(Journal).save([
            {
                title: 'test',
                content: 'bla bla bla',
                user_id: 1
            }
        ]);
    }
}
