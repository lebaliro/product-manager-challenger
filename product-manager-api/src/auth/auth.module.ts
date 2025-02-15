import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './strategies/apikey.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ApiKeyStrategy],
  imports: [PassportModule],
})
export class AuthModule {}
