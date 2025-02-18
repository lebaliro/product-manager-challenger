import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from './dtos/user.dto';
import { Public } from './decorators/auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  async singUp(@Body() userCreateDto: UserCreateDto) {
    return await this.authService.createUser(userCreateDto);
  }
}
