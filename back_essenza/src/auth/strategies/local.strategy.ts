import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const result = await this.authService.login({ email, senha: password });
      if (!result.user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      return result.user;
    } catch (error) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
