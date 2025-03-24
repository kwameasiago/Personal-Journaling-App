import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get('http://users-api:3000/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      request.user = response.data.user;
      return true;
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
