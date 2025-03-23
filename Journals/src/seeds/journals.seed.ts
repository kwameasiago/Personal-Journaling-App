import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from 'typeorm';
import { Journal } from "src/entities/journals.entity";

export default class CreateJournals implements Seeder{
    public async run(factory: Factory, connections: Connection):Promise<any>{
        await connections.getRepository(Journal).save([
            {
                title: 'test',
                content: 'bla bla bla',
                user_id: 1
            }
        ])
    }
}