import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from 'src/entities/roles.entity';
import { User } from 'src/entities/user.entity';

export default class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const roleRepository = connection.getRepository(Role)
        const adminRole = await roleRepository.findOne({ where: { name: 'Admin' } })
        const userRole = await roleRepository.findOne({ where: { name: 'User' } })
        if (!adminRole || !userRole) {
            throw new Error('Admin or User role not found');
        }

        const users: Partial<User>[] = [
            {
                username: 'John Doe',
                password: 'john@john.com',
                role: adminRole,
            },
            {
                username: 'Jane Doe',
                password: 'jane@jane.com',
                role: userRole,
            },
        ];
        await connection.getRepository(User).save(users)

    }
}