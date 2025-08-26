import { Injectable } from '@nestjs/common';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profissional } from './entities/profissional.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProfissionalService {

  constructor(
    @InjectRepository(Profissional)
    private profiRepo: Repository<Profissional>,
  ){}
  create(dto: CreateProfissionalDto) {
    const newProfissional = this.profiRepo.create(dto);
    return this.profiRepo.save(newProfissional);
  }

  findAll() {
    return this.profiRepo.find;
    }

  findOne(id: number) {
    return this.profiRepo.findOneBy({id});
  }

  async update(id: number, updateProfiDto: UpdateProfissionalDto) {
    const existingProfi = await this.profiRepo.preload({ id: id, ...updateProfiDto });
    if (!existingProfi) {
    throw new NotFoundException(`Profissional com o ID ${id} não encontrado!`);
   }
    return this.profiRepo.save(existingProfi);
  }
  
  remove(id: number) {
    return this.profiRepo.delete(id);
  };
}
