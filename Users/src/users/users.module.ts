import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/roles.entity';
import { Session } from 'src/entities/session.entity';
import { Logs } from 'src/entities/logs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Role, Session, Logs])
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
