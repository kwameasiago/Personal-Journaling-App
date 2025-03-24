import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as moment from 'moment';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let jwtToken;
  let endDate = moment().format('YYYYY-MM-DD')
  let startDate = moment(endDate, 'YYYY-MM-DD').add(1, 'weeks').format('YYYY-MM-DD')
  

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const {body} = await request('http://users-api:3000')
      .post('/users/login')
      .send({
        username: 'James Doe',
        password: 'password'
      })
      jwtToken = body.jwtToken;

      await request('http://journals-api:3001')
      .post('/journals')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'my day',
        content: 'bla bla blea',
        tags: [{name: 'school'}]
      })
  });


  it('should get journal-frequency', async () => {
    return request(app.getHttpServer())
      .get(`/analysis/journal-frequency?start_date=${startDate}&end_date=${endDate}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });


  it('should get category-distribution', async () => {
    return request(app.getHttpServer())
    .get(`/analysis/category-distribution?start_date=${startDate}&end_date=${endDate}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });


  it('should get word-length', async () => {
    return request(app.getHttpServer())
    .get(`/analysis/word-length?start_date=${startDate}&end_date=${endDate}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });

  it('should get word-length-by-category', async () => {
    return request(app.getHttpServer())
    .get(`/analysis/word-length-by-category?start_date=${startDate}&end_date=${endDate}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });

  it('should get time-of-day-distribution', async () => {
    return request(app.getHttpServer())
    .get(`/analysis/time-of-day-distribution?start_date=${startDate}&end_date=${endDate}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });
});
