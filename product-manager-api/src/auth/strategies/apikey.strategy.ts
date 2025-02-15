import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'X-API-KEY',
) {
  constructor(private readonly authService: AuthService) {
    super({ header: 'X-API-KEY', prefix: '' }, false);
  }

  validate(
    apiKey: string,
    done: (error: Error | null, validateResult: boolean | null) => void,
  ) {
    const checkKey = this.authService.validateApiKey(apiKey);
    if (checkKey) {
      done(null, true);
    }
    done(new UnauthorizedException('Usuário não autenticado!'), null);
  }
}
