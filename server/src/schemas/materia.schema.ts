import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'materias', timestamps: true })
export class Materia extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  no_creditos: number;

  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ type: [[String]] })
  prerrequisitos: string[][];

  @Prop({ required: true })
  carrera: string;

  @Prop({ required: true })
  usuario: string;
}

export const MateriaSchema = SchemaFactory.createForClass(Materia);
