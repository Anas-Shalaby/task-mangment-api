import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth.credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authServices: AuthService) {}

  @Post('/signup')
  async createUser(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<void> {
    return this.authServices.signUp(authCredentialsDTO);
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentials: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authServices.signIn(authCredentials);
  }
}
