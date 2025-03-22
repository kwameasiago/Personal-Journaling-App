import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { hashPassword } from 'src/utils';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/roles.entity';
import { Session } from 'inspector/promises';
import { Logs } from 'src/entities/logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    private readonly jwtService: JwtService,
  ) { }

  /**
   * Generates a JWT token for the session.
   *
   * @param payload - The session data for which to generate the token.
   * @returns The JWT token as a string.
   */
  private createJwtToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  /**
   * Retrieves the device info from the request headers.
   * @param req - The express request object.
   * @returns The user-agent string or a default value.
   */
  private getDevice(req: Request): string {
    return (req.headers['user-agent'] as string) || '-';
  }

  /**
   * Retrieves the client IP address from the request headers.
   * @param req - The express request object.
   * @returns The client IP address or a default value.
   */
  private getClientIp(req: Request): string {
    return (
      ((req.headers['x-forwarded-for'] as string)?.split(',')[0]) ||
      req.ip ||
      '-'
    );
  }

  /**
   * Registers a new user and logs the signup action.
   *
   * @param data - Registration data for the user.
   * @param req - The express request object.
   * @returns An object containing a JWT token and a greeting message.
   */
  async register(data: any, req: Request) {
    const userExist = await this.userRepository.findOne({
      where: { username: data.username },
    });
    if (userExist) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.FORBIDDEN,
      );
    }


    const device = this.getDevice(req);
    const ipAddress = this.getClientIp(req);

    const hashedPassword = await hashPassword(data.password);


    const result = await this.userRepository.manager.transaction(
      async (manager) => {
        const role = await this.roleRepository.findOne({
          where: { name: 'User' },
        });
        if (!role) {
          throw new HttpException(
            'Role does not exist',
            HttpStatus.BAD_REQUEST,
          );
        }

        const newUser = manager.create(User, {
          ...data,
          password: hashedPassword,
          role,
        });
        const savedUser = await manager.save(newUser);

        const logEntry = manager.create(Logs, {
          actions: 'SIGN UP',
          device,
          ip_address: ipAddress,
          user: savedUser,
        });
        await manager.save(logEntry);

        const jwtToken = this.createJwtToken({
          id: savedUser.id,
          username: savedUser.username,
          role: savedUser.role,
        });

        return {
          status: 'success',
          message: 'User registered successfully.',
          jwtToken
        };
      },
    );

    return result
  }
}
