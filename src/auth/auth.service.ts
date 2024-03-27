import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dto/auth.credentials.dto';
import * as bycrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private JWTService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredentials;

    // hash
    const salt = await bycrypt.genSalt();

    const hashedPassword = await bycrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentials: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentials;

    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bycrypt.compare(password, user.password))) {
      const payload: JWTPayload = { username };
      const accessToken: string = this.JWTService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
