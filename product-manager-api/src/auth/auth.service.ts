import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateApiKey(apiKey: string): boolean {
    return process.env.SECRET_KEY_PRODUCT_MANAGER === apiKey ? true : false;
  }
}
