import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from 'src/entities/roles.entity';

export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.getRepository(Role).save([
      {name: 'Admin', description: 'Administrator role' },
      {name: 'User', description: 'Regular user role' },
      {name: 'Guest', description: 'Guest user role' }
    ]);
  }
}
