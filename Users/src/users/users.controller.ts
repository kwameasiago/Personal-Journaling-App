import { Controller, Post,Get, Req, Body, HttpException , HttpStatus, HttpCode, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from './users.service';
import { RegisterBodyDto , LoginBodyDto} from './dto/users.dto';
import { JwtAuthGuard } from './auth.guard';


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

    @Get('sessions')
    @UseGuards(JwtAuthGuard)
    async getSessions(@Req() req: Request){
        return this.usersService.getSessions(req)
    }
}
