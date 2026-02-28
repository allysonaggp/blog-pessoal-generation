import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepositiry: Repository<Usuario>,
    private bcrypt: Bcrypt,
  ) {}

  async findByUsuario(usuario: string): Promise<Usuario | null> {
    return await this.usuarioRepositiry.findOne({
      where: { usuario: usuario },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepositiry.find();
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepositiry.findOne({
      where: { id },
    });
    if (!usuario)
      throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);
    return usuario;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const buscarUsuario = await this.findByUsuario(usuario.usuario);

    if (buscarUsuario)
      throw new HttpException('O Usuario já existe!', HttpStatus.BAD_REQUEST);

    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
    return await this.usuarioRepositiry.save(usuario);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    await this.findById(usuario.id);
    const buscarUsuario = await this.findByUsuario(usuario.usuario);

    if (buscarUsuario && buscarUsuario.id !== usuario.id)
      throw new HttpException(
        'Usuario (e-mail) já cadastrado',
        HttpStatus.BAD_REQUEST,
      );

    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
    return await this.usuarioRepositiry.save(usuario);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.usuarioRepositiry.delete(id);
  }
}
