import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { hashPassword, comparePassword } from 'src/utils';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/roles.entity';
import { Session } from 'src/entities/session.entity';
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
  * Retrieves a session from the repository by its unique identifier.
  *
  * @param {number} id - The unique identifier of the session.
  * @returns {Promise<Session | undefined>} A promise that resolves to the session object if found, or undefined if no matching session exists.
  */
  async getSessionById(id: number) {
    return this.sessionRepository.findOne({ where: { id } });
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

        const newSession = await manager.create(Session, {
          device: device,
          ip_address: ipAddress,
          user: savedUser
        })
        const savedSession = await manager.save(newSession)

        const jwtToken = this.createJwtToken({
          id: savedUser.id,
          username: savedUser.username,
          session: savedSession.id
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

  /**
   * Handles user login by validating credentials and creating a session.
   *
   * This function performs the following steps:
   * 1. Extracts device and IP address information from the incoming request.
   * 2. Finds the user by username from the user repository.
   * 3. Verifies the provided password against the stored hash.
   * 4. Creates a new session and logs the sign-in action within a transaction.
   * 5. Generates and returns a JWT token along with a success message.
   *
   * @param {any} data - The login data containing user credentials (username and password).
   * @param {Request} req - The incoming HTTP request, used to extract client device and IP address.
   * @returns {Promise<Object>} A promise that resolves to an object with the login status, message, and JWT token.
   * @throws {HttpException} Throws an HTTP 403 Forbidden exception if the user is not found or if the password check fails.
   */
  async login(data: any, req: Request):Promise<any> {
    const device = this.getDevice(req);
    const ipAddress = this.getClientIp(req);
    const user = await this.userRepository.findOne({ where: { username: data.username } })
    if (user == null) {
      throw new HttpException(
        'Username or Password incorrect',
        HttpStatus.FORBIDDEN,
      );
    }

    const passowrdCheck = await comparePassword(data.password, user.password)

    if (!passowrdCheck) {
      throw new HttpException(
        'Username or Password incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
    const result = await this.sessionRepository.manager.transaction(async (manager) => {
      const newSession = manager.create(Session, {
        device: device,
        ip_address: ipAddress,
        user: user
      })

      const savedSession = await manager.save(newSession)

      const newLog = manager.create(Logs, {
        actions: 'SIGN IN',
        device,
        ip_address: ipAddress,
        user: user,
      })

      const jwtToken = this.createJwtToken({
        id: user.id,
        username: user.username,
        session: savedSession.id
      })
      return {
        status: 'success',
        message: 'User logged in successfully.',
        jwtToken
      };
    })
    return result
  }

  /**
   * Retrieves paginated sessions for the logged-in user.
   *
   * @param req - The request object containing the user and query parameters.
   *   - req.user: Contains the authenticated user information.
   *   - req.query.page: (Optional) The current page number for pagination. Defaults to 1.
   *   - req.query.limit: (Optional) The number of sessions to display per page. Defaults to 10.
   *
   * @returns An object containing:
   *   - data: An array of session entities.
   *   - pagination: An object with pagination details such as total items, current page, limit, and total pages.
   */
  async getSessions(req) {
    const { user: { id } } = req;
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const [sessions, total] = await this.sessionRepository.findAndCount({
      where: { user: { id } },
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    });
    
    return {
      data: sessions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


 /**
 * Signs out the current user by deleting the active session.
 *
 * @param req - The request object containing the user and session id.
 *   - req.user: The authenticated user object, which includes the user's sessions.
 *   - req.sessionId: The id of the active session to be removed.
 *
 * @returns An object with a confirmation message and the user information.
 */
async signOut(req: Request) {
  const { user } = req;
  const sessionId: number = (user as any).session;
  await this.sessionRepository.delete({ id: sessionId });

  return {
    status: 'success',
    msg: 'Session signed out successfully',
  };
}
  
/**
 * Retrieves the current authenticated user along with their associated role details.
 * Excludes sensitive fields by explicitly selecting only the required columns.
 *
 * @param req - The request object containing the authenticated user.
 *   - req.user: The authenticated user object with at least an `id` property.
 * @returns An object containing:
 *   - status: A string indicating the status of the request.
 *   - user: The current user object with selected fields and joined role details.
 */
async currentUser(req){
  const { user } = req;
  const id: number = (user as any).id;
  const currentUser = await this.userRepository.createQueryBuilder('user')
    .innerJoinAndSelect('user.role', 'role')
    .select([
      'user.id', 
      'user.username', 
      'user.created_at',
      'user.updated_at',
      'role.id', 
      'role.name',
      'role.created_at',
      'role.updated_at'
    ])
    .where('user.id = :id', { id })
    .getOne();

  return {
    status: 'success',
    user: currentUser
  }
}

}
