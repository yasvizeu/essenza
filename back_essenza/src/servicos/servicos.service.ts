import { Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Servico } from './entities/servico.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicosService {
  constructor(
    @InjectRepository(Servico)
    private servicoRepo: Repository<Servico>,
  ) {}

  create(createServicoDto: CreateServicoDto) {
    const newServico = this.servicoRepo.create(createServicoDto);
    return this.servicoRepo.save(newServico);
  }

  findAll() {
    return this.servicoRepo.find();
  }

  findOne(id: number) {
    return this.servicoRepo.findOneBy({ id });
  }

  async update(id: number, updateServicoDto: UpdateServicoDto) {
    const existingServico = await this.servicoRepo.preload({ id, ...updateServicoDto });
    if (!existingServico) {
      throw new Error(`Serviço com o ID ${id} não encontrado!`);
    }
    return this.servicoRepo.save(existingServico);
  }

  remove(id: number) {
    return this.servicoRepo.delete(id);
  }
}
