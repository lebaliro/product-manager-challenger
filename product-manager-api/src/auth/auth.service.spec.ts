/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoggerModule } from 'src/common/logger/logger.module';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { UserCreateDto, UserDto } from './dtos/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('AuthService', () => {
  let authService: AuthService;
  let logger: LoggerGlobal;
  let prisma: PrismaService;
  let mockUserCreateDto: UserCreateDto;
  let mockUser: UserDto;
  let mockUserCreated: object;
  let mockFindFirstUser: object;

  beforeEach(async () => {
    mockUserCreateDto = {
      cpf: '17350968060',
    };
    mockUser = { id: 1, apikey: 'wag28564', cpf: mockUserCreateDto.cpf };

    mockUserCreated = {
      data: {
        cpf: mockUser.cpf,
        apikey: mockUser.apikey,
      },
    };

    mockFindFirstUser = {
      where: {
        apikey: mockUser.apikey,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
      imports: [LoggerModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    logger = module.get<LoggerGlobal>(LoggerGlobal);
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(prisma).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should dependencies be injected', () => {
    expect(authService).toHaveProperty('prisma');
    expect(authService['prisma']).toBe(prisma);

    expect(authService).toHaveProperty('logger');
    expect(authService['logger']).toBe(logger);
  });

  describe('validateApiKey', () => {
    it('should be successful validating api key', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const user = await authService.validateApiKey(mockUser.apikey);

      expect(user).toBe(mockUser);
      expect(prisma.user.findFirst).toHaveBeenCalledWith(mockFindFirstUser);
    });

    it('should not be successful validating api key', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const isValide = await authService.validateApiKey(mockUser.apikey);

      expect(isValide).toBe(null);
      expect(prisma.user.findFirst).toHaveBeenCalledWith(mockFindFirstUser);
    });
  });

  describe('createApiKey', () => {
    it('should create user apikey', async () => {
      authService.generateApiKey = jest.fn().mockReturnValue(mockUser.apikey);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const mockUserApiKey = await authService.createUser(mockUserCreateDto);

      expect(mockUserApiKey.apikey).toBe(mockUser.apikey);
      expect(authService.generateApiKey).toHaveBeenCalledWith(
        mockUserCreateDto.cpf,
      );
      expect(prisma.user.create).toHaveBeenCalledWith(mockUserCreated);
    });

    it('should return error "user already exists"', async () => {
      // Acredito que dê para melhorar esse teste
      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`cpf`)',
        {
          code: 'P2002',
          clientVersion: '6.3.1',
          meta: { target: ['cpf'] },
        },
      );
      authService.generateApiKey = jest.fn().mockReturnValue(mockUser.apikey);
      (prisma.user.create as jest.Mock).mockRejectedValue(prismaError);

      await expect(authService.createUser(mockUserCreateDto)).rejects.toThrow();

      expect(authService.generateApiKey).toHaveBeenCalledWith(
        mockUserCreateDto.cpf,
      );
      expect(prisma.user.create).toHaveBeenCalledWith(mockUserCreated);
    });
  });

  describe('generateApiKey', () => {
    it('should generate apikey', () => {
      const cpf = '17350968060';

      const apiKey = authService.generateApiKey(cpf);

      expect(apiKey).toHaveLength(48);
    });
  });
});
