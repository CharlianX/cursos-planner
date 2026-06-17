import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Planeacion } from '../schemas/planeacion.schema';

@Injectable()
export class PlaneacionesService {
  constructor(
    @InjectModel(Planeacion.name)
    private planeacionModel: Model<Planeacion>,
  ) {}

  async findByUser(usuario: string): Promise<Planeacion[]> {
    return this.planeacionModel.find({ usuario }).exec();
  }

  async create(data: Partial<Planeacion>): Promise<Planeacion> {
    const planeacion = new this.planeacionModel(data);
    return planeacion.save();
  }

  async update(
    id: string,
    data: Partial<Planeacion>,
  ): Promise<Planeacion | null> {
    return this.planeacionModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.planeacionModel.findByIdAndDelete(id).exec();
  }
}
