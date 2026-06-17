import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'planeaciones', timestamps: true })
export class Planeacion extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  usuario: string;

  @Prop({ type: [[String]] })
  materias: string[][];
}

export const PlaneacionSchema = SchemaFactory.createForClass(Planeacion);
