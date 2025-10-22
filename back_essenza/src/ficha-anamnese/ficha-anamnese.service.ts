import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFichaAnamneseDto } from './dto/create-ficha-anamnese.dto';
import { UpdateFichaAnamneseDto } from './dto/update-ficha-anamnese.dto';
import { FichaAnamnese } from './entities/ficha-anamnese.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Injectable()
export class FichaAnamneseService {
  constructor(
    @InjectRepository(FichaAnamnese)
    private fichaRepo: Repository<FichaAnamnese>,

    @InjectRepository(Cliente)
    private clientRepo: Repository<Cliente>,
  ){}

  async create(createFichaAnamneseDto: CreateFichaAnamneseDto): Promise<FichaAnamnese> {
    const cliente = await this.clientRepo.findOne({
      where: {id: createFichaAnamneseDto.clienteId},
    })

    if(!cliente) {
      throw new NotFoundException(`Cliente com o ID ${createFichaAnamneseDto.clienteId} não encontrado`)
    }

    const novaFicha = this.fichaRepo.create({
      ...createFichaAnamneseDto,
      cliente: cliente,
    })
    return this.fichaRepo.save(novaFicha);
  }

  findAll() {
    return this.fichaRepo.find();
  }

  async findByClienteId(clienteId: number) {
    return this.fichaRepo.findOne({
      where: { cliente: { id: clienteId } },
      relations: ['cliente']
    });
  }

  findOne(id: number) {
    return this.fichaRepo.findOneBy({id});
  }

  async update(id: number, updateFichaAnamneseDto: UpdateFichaAnamneseDto) {
    const existingFicha = await this.fichaRepo.preload({id: id, ...updateFichaAnamneseDto});

    if (!existingFicha) {
      throw new NotFoundException(`Ficha com o ID ${id} do cliente com o ID ${updateFichaAnamneseDto.clienteId} não encontrado!`)
    }

    return this.fichaRepo.save(existingFicha);
  }

  remove(id: number) {
    return this.fichaRepo.delete(id);
  }
}
