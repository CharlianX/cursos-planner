import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaneacionesController } from './planeaciones.controller';
import { PlaneacionesService } from './planeaciones.service';
import { Planeacion, PlaneacionSchema } from '../schemas/planeacion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Planeacion.name, schema: PlaneacionSchema },
    ]),
  ],
  controllers: [PlaneacionesController],
  providers: [PlaneacionesService],
})
export class PlaneacionesModule {}
