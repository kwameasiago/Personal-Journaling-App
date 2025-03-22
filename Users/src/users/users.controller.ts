import { Controller, Post, Req, Body, HttpException , HttpStatus, HttpCode} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { RegisterBodyDto , LoginBodyDto} from './dto/users.dto';


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
            throw new HttpException('An error occurred', HttpStatus.BAD_GATEWAY);
        }
    }
    

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginBodyDto: LoginBodyDto, @Req() req: Request){
        try {
            return this.usersService.login(loginBodyDto, req)
        } catch (error) {
            throw new HttpException('An error occurred', HttpStatus.BAD_GATEWAY);

        }
    }
}
