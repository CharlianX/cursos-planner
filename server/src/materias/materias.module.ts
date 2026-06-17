import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MateriasController } from './materias.controller';
import { MateriasService } from './materias.service';
import { Materia, MateriaSchema } from '../schemas/materia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Materia.name, schema: MateriaSchema }]),
  ],
  controllers: [MateriasController],
  providers: [MateriasService],
})
export class MateriasModule {}
