import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from './users.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secret',
        });
    }

  /**
  * Validates the provided JWT payload by ensuring the session exists.
  *
  * This function checks if the session corresponding to the payload's session identifier exists
  * in the system. If no session is found, it throws a Forbidden HTTP exception.
  *
  * @param payload - The decoded JWT payload containing session information.
  * @returns The original payload if validation is successful.
  * @throws {HttpException} Throws a 403 Forbidden error if the session does not exist.
  */
    async validate(payload: any) {
        const session = await this.userService.getSessionById(payload.session);
        if (session == null) {
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
        }

        return payload;
    }

}