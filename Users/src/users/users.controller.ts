import { Controller, Post, Req, Body, HttpException , HttpStatus} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { RegisterBodyDto } from './dto/users.dto';


@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ){}
    
    @Post('register')
    async register(@Body() registerBodyDto: RegisterBodyDto, @Req() req: Request){
        try {
            return  this.usersService.register(registerBodyDto, req)
        } catch (error) {
            throw new HttpException('An error occurred during file upload', HttpStatus.BAD_GATEWAY);
        }
    }
    
}
