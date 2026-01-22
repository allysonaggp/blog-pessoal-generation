import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsuarioService } from '../../usuario/services/usuario.service';
import { Bcrypt } from '../bcrypt/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuarioLogin } from '../entities/usuariologin.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const buscarUsuario = await this.usuarioService.findByUsuario(username);
    if (!buscarUsuario)
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    const matchPassword = await this.bcrypt.compararSenhas(
      password,
      buscarUsuario.senha,
    );
    if (buscarUsuario && matchPassword) {
      const { senha, ...resposta } = buscarUsuario;
      return resposta;
    }
    return null;
  }
  async login(usuarioLogin: UsuarioLogin) {
    const payload = { sub: usuarioLogin.usuario };
    const buscarUsuario = await this.usuarioService.findByUsuario(
      usuarioLogin.usuario,
    );
    return {
      id: buscarUsuario?.id,
      nome: buscarUsuario.nome,
      senha: '',
      foto: buscarUsuario?.foto,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
