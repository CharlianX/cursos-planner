import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Materia } from '../schemas/materia.schema';

@Injectable()
export class MateriasService {
  constructor(
    @InjectModel(Materia.name) private materiaModel: Model<Materia>,
  ) {}

  async findAll(): Promise<Materia[]> {
    return this.materiaModel.find().exec();
  }

  async create(data: Partial<Materia>): Promise<Materia> {
    const materia = new this.materiaModel(data);
    return materia.save();
  }

  async bulkCreate(data: Partial<Materia>[]): Promise<Materia[]> {
    if (!Array.isArray(data)) {
      throw new HttpException('Expected an array', HttpStatus.BAD_REQUEST);
    }
    return this.materiaModel.insertMany(data as any) as any;
  }

  async update(id: string, data: Partial<Materia>): Promise<Materia | null> {
    return this.materiaModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.materiaModel.findByIdAndDelete(id).exec();
  }
}
