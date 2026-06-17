import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PlaneacionesService } from './planeaciones.service';
import { Planeacion } from '../schemas/planeacion.schema';

@Controller('planeaciones')
export class PlaneacionesController {
  constructor(
    private readonly planeacionesService: PlaneacionesService,
  ) {}

  @Get(':usuario')
  async findByUser(@Param('usuario') usuario: string): Promise<Planeacion[]> {
    return this.planeacionesService.findByUser(usuario);
  }

  @Post()
  async create(@Body() body: Partial<Planeacion>): Promise<Planeacion> {
    return this.planeacionesService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Planeacion>,
  ): Promise<Planeacion | null> {
    return this.planeacionesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.planeacionesService.delete(id);
    return { message: 'Planeacion eliminada' };
  }
}
