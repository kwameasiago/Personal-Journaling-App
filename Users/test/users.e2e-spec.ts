import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Session } from 'inspector/promises';
import { Role } from 'src/entities/roles.entity';
import { Logs } from 'src/entities/logs.entity';
import { hashPassword } from 'src/utils';

describe('UsersController (2e2)', () => {
    let app: INestApplication<App>;
    let userRepository;
    let roleRepository;
    let logsRepository;
    let sessionRepository;
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
          }).compile();
      
          app = moduleFixture.createNestApplication();
          app.useGlobalPipes(
            new ValidationPipe({
              whitelist: true,  
              transform: true,  
              forbidNonWhitelisted: true,
            }),
          );
          await app.init();
          
          roleRepository = moduleFixture.get(getRepositoryToken(Role))
          userRepository = moduleFixture.get(getRepositoryToken(User))
          const role = await roleRepository.save({
            name: 'User',
            description: 'Just a user'
          })
          await userRepository.save({
            username: 'Jane Doe',
            password: await hashPassword('password'),
            role
          })
          



    })

    afterAll(async () => {
        await roleRepository.delete({})
        await userRepository.delete({})
        await app.close()
    })

    it('should register new user', () => {
        return request(app.getHttpServer())
        .post('/users/register')
        .send({
            username: 'name',
            password: 'password'
        })
        .expect(201)
    })


    it('should throw error when username exist', () => {
        return request(app.getHttpServer())
        .post('/users/register')
        .send({
            username: 'Jane Doe',
            password: 'password'
        })
        .expect(403)
    })


    it('should throw error password is not provided', () => {
        return request(app.getHttpServer())
        .post('/users/register')
        .send({
            username: 'john'
        })
        .expect(400)
    })

    it('should throw error passowrd is not provided', () => {
        return request(app.getHttpServer())
        .post('/users/register')
        .send({
            password: 'alex'
        })
        .expect(400)
    })

    it('should login user successfully', () => {
        return request(app.getHttpServer())
        .post('/users/login')
        .send({
            username: 'Jane Doe',
            password: 'password'
        })
        .expect(200)
    })

    it('should deny access to invalid credentials', () => {
        return request(app.getHttpServer())
        .post('/users/login')
        .send({
            username: 'Jane Doe',
            password: 'passwords'
        })
        .expect(403)
    })


    it('should deny access to invalid credentials', async () => {
        const {body: {jwtToken}} = await request(app.getHttpServer())
        .post('/users/login') 
        .send({
            username: 'Jane Doe',
            password: 'password'
        })

        return request(app.getHttpServer())
        .get('/users/sessions')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
    })
})