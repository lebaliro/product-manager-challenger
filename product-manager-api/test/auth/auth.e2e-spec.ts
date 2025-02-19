import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { UserCreateDto } from 'src/auth/dtos/auth.dto';
import { USER_ALREADY_EXISTS } from 'src/auth/utils/auth.response';
import { CreateProductDto } from 'src/products/dtos/products.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let originalDatabaseUrl: string | undefined;

  beforeAll(async () => {
    originalDatabaseUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Não está funcionando, ainda.
    // app.useGlobalPipes(
    //   new ValidationPipe({
    //     whitelist: true,
    //     transform: true,
    //     forbidNonWhitelisted: true,
    //   }),
    // );

    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    process.env.DATABASE_URL = originalDatabaseUrl;
    await prisma.$disconnect();
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
    const uri = '/auth/signup';

    it('should create a new user', async () => {
      const mockUserCreateDto = {
        cpf: '51518412315',
      };

      const response = await request(app.getHttpServer())
        .post(uri)
        .send(mockUserCreateDto)
        .expect(201);

      const userInDb = await prisma.user.findUnique({
        where: { cpf: mockUserCreateDto.cpf },
      });

      const responseBody = response.body as { apikey: string };

      expect(userInDb).toBeDefined();
      expect(userInDb?.cpf).toBe(mockUserCreateDto.cpf);
      expect(userInDb?.apikey).toBe(responseBody.apikey);
    });

    it('should conflict if CPF is already registered', async () => {
      const mockUserCreateDto = {
        cpf: '15651651',
      };

      const mockUserCreateData = {
        cpf: mockUserCreateDto.cpf,
        apikey: 'apikeyvalue',
      };

      await prisma.user.create({
        data: mockUserCreateData,
      });

      const response = await request(app.getHttpServer())
        .post(uri)
        .send(mockUserCreateDto)
        .expect(409);

      const responseBody = response.body as { message: string };

      expect(responseBody.message).toContain(USER_ALREADY_EXISTS);
    });
    it('should return not found because route is wrong', async () => {
      const mockUserCreateDto = {
        cpf: '51518415115',
      };

      const response = await request(app.getHttpServer())
        .post(uri + 'sad')
        .send(mockUserCreateDto)
        .expect(404);
      const responseBody = response.body as { message: string };

      expect(responseBody.message).toContain('Cannot POST /auth/signupsad');
    });
    // TODO descobrir como ativar o class-validator no e2e test
    // it('should return 400 to invalide payload request', async () => {
    //   const userCreateDto = {
    //     cpf: 51518412315,
    //   };

    //   const response = await request(app.getHttpServer())
    //     .post('/auth/signup')
    //     .set('Content-Type', 'application/json')
    //     .send(JSON.stringify(userCreateDto))
    //     .expect(400);

    //   expect(response.body).toBe('naruto');
    // });
  });
});
