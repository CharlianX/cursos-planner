import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../schemas/usuario.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async login(usuario: string, contrasena: string) {
    if (!usuario || !contrasena) {
      throw new HttpException(
        'Usuario y contrasena son requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usuarioModel.findOne({ usuario });

    if (user) {
      const isMatch = await bcrypt.compare(contrasena, user.contrasena);
      if (!isMatch) {
        throw new HttpException('Contraseña incorrecta', HttpStatus.UNAUTHORIZED);
      }
      return { message: 'Login exitoso', usuario: user.usuario };
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const newUser = new this.usuarioModel({ usuario, contrasena: hashedPassword });
    await newUser.save();
    return {
      message: 'Usuario registrado y logueado',
      usuario: newUser.usuario,
    };
  }
}
