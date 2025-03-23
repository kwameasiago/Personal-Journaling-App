import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from 'typeorm';
import { Tags } from "src/entities/tags.entity";
import { Journal } from "src/entities/journals.entity";

export default class CreateTags implements Seeder{
    public async run(factory: Factory, connections: Connection):Promise<any>{
        const journalsRepository = connections.getRepository(Journal)
        
        const journal = await journalsRepository.findOne({where: {title: 'test'}})
        if (!journal) {
            throw new Error('Journal with id 1 not found');
          }
        await connections.getRepository(Tags).save([
            {
                name: 'string',
                journal: journal

            }
        ])
    }
}