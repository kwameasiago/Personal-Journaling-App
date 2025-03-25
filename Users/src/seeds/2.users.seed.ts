import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from 'src/entities/roles.entity';
import { User } from 'src/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { hashPassword } from 'src/utils';

export default class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const roleRepository = connection.getRepository(Role);
        const adminRole = await roleRepository.findOne({ where: { name: 'Admin' } });
        const userRole = await roleRepository.findOne({ where: { name: 'User' } });
        
        if (!adminRole || !userRole) {
            throw new Error('Admin or User role not found');
        }

        const users: Partial<User>[] = [
            {
                username: 'John Doe',
                password: await hashPassword('password'),
                role: adminRole,
            },
            {
                username: 'Jane Doe',
                password: await hashPassword('password'),
                role: userRole,
            },
        ];
        const savedUsers = await connection.getRepository(User).save(users);
        
        const userIds = savedUsers.map(user => user.id).join(',');
        
        const filePath = path.resolve(__dirname, '../../../seed_user.txt');
        
        fs.writeFileSync(filePath, userIds, 'utf8');

        console.log(`User IDs saved to ${filePath}`);
    }
}
