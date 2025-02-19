import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './strategies/apikey.strategy';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ApiKeyStrategy],
  imports: [PassportModule, PrismaModule, LoggerModule],
})
export class AuthModule {}
