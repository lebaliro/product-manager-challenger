/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserCreateDto } from './dtos/user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockApiKey: { apikey: string };

  beforeEach(async () => {
    mockApiKey = { apikey: 'apikeyvalue' };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockApiKey),
          },
        },
      ],
      imports: [PrismaModule],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should dependencies be injected', () => {
    expect(authController).toHaveProperty('authService');
    expect(authController['authService']).toBe(authService);
  });

  describe('singUp', () => {
    it('should return apikey', async () => {
      const userCreateDto: UserCreateDto = {
        cpf: '17350968060',
      };

      const apikey = await authController.singUp(userCreateDto);

      expect(apikey).toBe(mockApiKey);
      expect(authService.createUser).toHaveBeenCalledWith(userCreateDto);
    });
  });
});
