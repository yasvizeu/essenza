import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../dto/auth.dto';
import { jwtConfig } from '../../../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    console.log('🔍 Backend - JwtStrategy - Validando payload:', payload);
    try {
      const user = await this.authService.validateUser(payload.sub, payload.tipo);
      console.log('🔍 Backend - JwtStrategy - Usuário validado:', user);
      if (!user) {
        console.log('🔍 Backend - JwtStrategy - Usuário não encontrado');
        throw new UnauthorizedException('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      console.log('🔍 Backend - JwtStrategy - Erro na validação:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
