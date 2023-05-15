import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'nestjs-prisma';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await prismaService.enableShutdownHooks(app);

    const configService = moduleFixture.get<ConfigService>(ConfigService);
    app.use(cookieParser(configService.get<string>('JWT_ACCESS_SECRET')));

    await app.init();
  });

  afterAll(async () => {
    const deleteUsers = prismaService.user.deleteMany();

    await prismaService.$transaction([deleteUsers]);
  });

  // WARNING: execution is important in this test.
  // The user is only accessible after signing up,
  // and is only cleared when the whole suite is completed.

  describe('/signup', () => {
    it('should return status 201, set JWT cookie and create a new user', async () => {
      await request(app.getHttpServer())
        .post('/users/signup')
        .send({ email: 'test@test.com', name: 'tester', password: '12345678' })
        .expect(201)
        .expect('set-cookie', /^jwt/);
      expect(prismaService.user.findMany()).resolves.toHaveLength(1);
    });

    it('should return status 409 for duplicate email', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .send({ email: 'test@test.com', name: 'tester', password: '12345678' })
        .expect(409);
    });

    it('should return status 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .send({ email: 'test', name: 'tester', password: '12345678' })
        .expect(400);
    });

    it('should return status 400 for invalid password', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .send({ email: 'test@test.com', name: 'tester', password: '1234' })
        .expect(400);
    });

    it('should return status 400 for missing fields', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .send({})
        .expect(400);
    });
  });

  describe('/signin', () => {
    it('should return status 200, set JWT cookie when the correct credentials is supplied', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({ email: 'test@test.com', password: '12345678' })
        .expect(200)
        .expect('set-cookie', /^jwt/);
    });

    it('should return status 400 for unknown email', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({ email: 'unknown@test.com', password: '12345678' })
        .expect(400);
    });

    it('should return status 400 for incorrect password', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({ email: 'test@test.com', password: 'wrongpassword' })
        .expect(400);
    });

    it('should return status 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({ email: 'test', password: '12345678' })
        .expect(400);
    });

    it('should return status 400 for invalid password', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({ email: 'test@test.com', password: '1234' })
        .expect(400);
    });

    it('should return status 400 for missing fields', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({})
        .expect(400);
    });
  });

  describe('/signout', () => {
    it('should return status 200 and clear cookies if the user is signed in', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/signin')
        .send({ email: 'test@test.com', password: '12345678' });
      const cookie = response.get('Set-Cookie');

      return request(app.getHttpServer())
        .post('/users/signout')
        .set('Cookie', cookie)
        .expect(200)
        .expect('set-cookie', /^jwt.*Expires=Thu, 01 Jan 1970 00:00:00 GMT;/);
    });

    it('should return status 401 if the user is not currently signed in', () => {
      return request(app.getHttpServer()).post('/users/signout').expect(401);
    });
  });

  describe('/current-user', () => {
    it('should return status 200 and info about the current user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/signin')
        .send({ email: 'test@test.com', password: '12345678' });
      const cookie = response.get('Set-Cookie');

      const currentUserResponse = await request(app.getHttpServer())
        .get('/users/current-user')
        .set('Cookie', cookie)
        .expect(200);
      expect(currentUserResponse.body.email).toEqual('test@test.com');
      expect(currentUserResponse.body.id).toBeDefined();
      expect(currentUserResponse.body.password).toBeUndefined();
    });

    it('should return status 401 if the user is not currently signed in', () => {
      return request(app.getHttpServer())
        .get('/users/current-user')
        .expect(401);
    });
  });
});
