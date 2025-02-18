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

  async validate(
    apikey: string,
    done: (error: Error | null, validateResult: object | null) => void,
  ) {
    const user = await this.authService.validateApiKey(apikey);
    if (!user) {
      return done(new UnauthorizedException('Usuário não autenticado!'), user);
    }
    return done(null, user);
  }
}
