import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { ApiKeyStrategy } from './apikey.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../dtos/auth.dto';

describe('ApiKeyStrategy', () => {
  let authService: AuthService;
  let apiKeyStrategy: ApiKeyStrategy;
  let done: jest.Mock;
  let mockUser: UserDto;

  beforeEach(async () => {
    mockUser = {
      id: 1,
      apikey: 'apikey',
      cpf: 'cpf',
    };
    done = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateApiKey: jest.fn(),
          },
        },
        ApiKeyStrategy,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    apiKeyStrategy = module.get<ApiKeyStrategy>(ApiKeyStrategy);
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(apiKeyStrategy).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should dependencies be injected', () => {
    expect(apiKeyStrategy).toHaveProperty('authService');
    expect(apiKeyStrategy['authService']).toBe(authService);
  });

  describe('validate', () => {
    it('should authenticate with apikey', async () => {
      (authService.validateApiKey as jest.Mock).mockResolvedValue(mockUser);

      await apiKeyStrategy.validate(mockUser.apikey, done);

      expect(done).toHaveBeenCalledWith(null, mockUser);
    });

    it('should not authenticate with apikey', async () => {
      (authService.validateApiKey as jest.Mock).mockResolvedValue(null);

      await apiKeyStrategy.validate(mockUser.apikey, done);

      expect(done).toHaveBeenCalledWith(
        new UnauthorizedException('Usuário não autenticado!'),
        null,
      );
    });
  });
});
