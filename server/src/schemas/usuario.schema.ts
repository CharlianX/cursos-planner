import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'usuarios', timestamps: true })
export class Usuario extends Document {
  @Prop({ required: true, unique: true })
  usuario: string;

  @Prop({ required: true })
  contrasena: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
