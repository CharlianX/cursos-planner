import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MateriasModule } from './materias/materias.module';
import { PlaneacionesModule } from './planeaciones/planeaciones.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/courseplanner'),
    AuthModule,
    MateriasModule,
    PlaneacionesModule,
  ],
})
export class AppModule {}
