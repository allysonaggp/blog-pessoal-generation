import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Postagem } from '../../entities/postagem.entity';
import { PostagemService } from '../postagem.services';

@Controller('/postagens')
export class PostagemController {
  constructor(private readonly postagemService: PostagemService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Postagem[]> {
    return this.postagemService.findAll();
  }
}
