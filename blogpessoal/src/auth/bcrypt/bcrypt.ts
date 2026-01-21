import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async critografarSenha(senha: string): Promise<string> {
    const saltos: number = 10;
    return await bcrypt.hash(senha, saltos);
  }
  async compararSenhas(
    senhaDigitada: string,
    senhaBanco: string,
  ): Promise<boolean> {
    return await bcrypt.compare(senhaDigitada, senhaBanco);
  }
}
