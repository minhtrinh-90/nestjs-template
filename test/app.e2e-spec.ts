import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await prismaService.enableShutdownHooks(app);

    await app.init();
  });

  it('/ (GET) should return status 200 and OK message', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('OK');
  });
});
