import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { serviceEvent } from "src/entities/serviceEvent.entity";

export default class CreateEventService implements Seeder{
    public async run(factory: Factory, connection:Connection):Promise<any>{
    connection.getRepository(serviceEvent).save([
        {
            type: 'create_journal'
        }
    ])
    }
}

