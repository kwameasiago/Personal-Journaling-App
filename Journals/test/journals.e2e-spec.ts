import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Journal } from 'src/entities/journals.entity';
import { Tags } from 'src/entities/tags.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let jwtToken;
  let journalsRepository;
  let tagsRepository;




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
    const {body} = await request('http://users-api:3000')
      .post('/users/login')
      .send({
        username: 'James Doe',
        password: 'password'
      })
      jwtToken = body.jwtToken;

    await app.init();

    journalsRepository = moduleFixture.get(getRepositoryToken(Journal))
    tagsRepository = moduleFixture.get(getRepositoryToken(Tags))
  });

  afterAll(async () => {
    await journalsRepository.delete({})
    await tagsRepository.delete({})
  })

  it('should create a new journal', () => {
    return request(app.getHttpServer())
      .post('/journals')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'my day',
        content: 'bla bla blea',
        tags: [{name: 'school'}]
      })
      .expect(201)
  });

  it('should update a new journal', async () => {
    const journal = await journalsRepository.findOne({where: {title: 'my day'}})

    return request(app.getHttpServer())
      .put(`/journals/${journal.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'my day',
        content: 'bla bla blea',
        tags: [{name: 'school'}]
      })
      .expect(200)
  });

  it('should get one journal', async () => {
    const journal = await journalsRepository.findOne({where: {title: 'my day'}})

    return request(app.getHttpServer())
      .get(`/journals/${journal.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });

  it('should get all journal', async () => {
    return request(app.getHttpServer())
      .get('/journals')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });

  it('should delete a  journal', async () => {
    const journal = await journalsRepository.findOne({where: {title: 'my day'}})

    return request(app.getHttpServer())
      .delete(`/journals/${journal.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });





});
