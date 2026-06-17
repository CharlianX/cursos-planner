import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { MateriasService } from './materias.service';
import { Materia } from '../schemas/materia.schema';

@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Get()
  async findAll(): Promise<Materia[]> {
    return this.materiasService.findAll();
  }

  @Post()
  async create(@Body() body: Partial<Materia>): Promise<Materia> {
    return this.materiasService.create(body);
  }

  @Post('bulk')
  async bulkCreate(@Body() body: Partial<Materia>[]) {
    return this.materiasService.bulkCreate(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Materia>,
  ): Promise<Materia | null> {
    return this.materiasService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.materiasService.delete(id);
    return { message: 'Materia eliminada' };
  }
}
