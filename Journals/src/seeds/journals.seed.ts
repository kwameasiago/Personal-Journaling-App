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

        // Extract journal IDs (assuming there is only one journal in this case)
        const journalIds = savedJournals.map(journal => journal.id).join(',');

        // Resolve the file path relative to the current file's directory
        const filePath = path.resolve(__dirname, '../../../seed_journals.txt');

        // Write the journal IDs to the file
        fs.writeFileSync(filePath, journalIds, 'utf8');

        console.log(`Journal IDs saved to ${filePath}`);
    }
}
