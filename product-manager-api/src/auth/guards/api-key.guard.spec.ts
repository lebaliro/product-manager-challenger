/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyAuthGuard } from './api-key.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common/interfaces';

describe('ApiKeyAuthGuard', () => {
  let apiKeyAuthGuard: ApiKeyAuthGuard;
  let reflector: Reflector;
  let mockInternalServices: { method: jest.Mock }; // Esse mock representa o serviço que está sendo chamado para verificar se ele é público ou não.
  let context: ExecutionContext;

  beforeEach(async () => {
    mockInternalServices = {
      method: jest.fn(),
    };

    context = {
      getHandler: jest.fn().mockReturnValue(() => {
        return mockInternalServices.method;
      }),
      getClass: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToHttp: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyAuthGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    apiKeyAuthGuard = module.get<ApiKeyAuthGuard>(ApiKeyAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => jest.resetAllMocks());

  it('should be define', () => {
    expect(apiKeyAuthGuard).toBeDefined();
    expect(reflector).toBeDefined();
  });

  it('should dependecies be injected', () => {
    expect(apiKeyAuthGuard).toHaveProperty('reflector');
    expect(apiKeyAuthGuard['reflector']).toBe(reflector);
  });

  describe('canActivate', () => {
    it('should return true if route is public', () => {
      (reflector.get as jest.Mock).mockReturnValue(true);

      const isRoutePublic = apiKeyAuthGuard.canActivate(context);

      expect(isRoutePublic).toBe(true);
      expect(reflector.get).toHaveBeenCalledWith(
        'isPublic',
        context.getHandler(),
      );
    });
    // it('should return super if route is not public', () => {
    //   TODO Aprender a mockar a classe pai sem interferir a classe filho
    //     (reflector.get as jest.Mock).mockReturnValue(false);
    //     const isRoutePublic = apiKeyAuthGuard.canActivate(context);
    //     expect(isRoutePublic).toBe(false);
    //     expect(reflector.get).toHaveBeenCalledWith(
    //       'isPublic',
    //       context.getHandler(),
    //     );
    // });
  });
});
