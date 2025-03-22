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
            throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginBodyDto: LoginBodyDto, @Req() req: Request){
        try {
            return this.usersService.login(loginBodyDto, req)
        } catch (error) {
            throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @Get('sessions')
    @UseGuards(JwtAuthGuard)
    async getSessions(@Req() req: Request){
        return this.usersService.getSessions(req)
    }

    @Post('signout')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async signout(@Req() req: Request){
        try {
            return this.usersService.signOut(req)
        } catch (error) {
            throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Get('me')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async currentUser(@Req() req: Request){
        try {
            return this.usersService.currentUser(req)
        } catch (error) {
            throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
