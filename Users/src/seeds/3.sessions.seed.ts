import { Seeder, Factory } from "typeorm-seeding";
import { Connection } from 'typeorm';
import { User } from "src/entities/user.entity";
import { Session } from "src/entities/session.entity";

export default class CreateSessions implements Seeder{
    public async run(factory: Factory, connection: Connection): Promise<any>{
        const userRepository = connection.getRepository(User)
        const johnDoe = await userRepository.findOne({where: {username: 'John Doe'}})
        const janeDoe = await userRepository.findOne({where: {username: 'John Doe'}})

        if(!johnDoe || !janeDoe){
            throw new Error('users are undefined')
        }
        await connection.getRepository(Session).save([
            {
                token: 'asdapsdasdapsd', 
                device: 'sumsang', 
                ip_address: '12344343',
                user: johnDoe
            },
            {
                token: 'adsfgh', 
                device: 'phone', 
                ip_address: '3123123',
                user: johnDoe
            }
        ])
    }
}