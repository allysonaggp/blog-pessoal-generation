import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private _usernameField: string;
  private _passswordField: string;

  constructor(private readonly authService: AuthService) {
    super();
    this._usernameField = 'usuario';
    this._passswordField = 'senha';
  }

  async validate(usuariio: string, senha: string): Promise<any> {
    const validaUsuario = await this.authService.validateUser(Usuario, senha);
    if (!validaUsuario) {
      throw new UnauthorizedException('Usuário e/ou senha incorretos');
    }
    return validaUsuario;
  }
}
