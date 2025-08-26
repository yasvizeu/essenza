import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientesService {

  constructor(
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
  ){}
  async create(dto: CreateClienteDto): Promise<Cliente> {
    const newClient = this.clienteRepo.create(dto);
    return this.clienteRepo.save(newClient);
  }

  findAll() {
    return this.clienteRepo.find;
  }

  findOne(id: number) {
    return this.clienteRepo.findOneBy({id});
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const existingClient = await this.clienteRepo.preload({id: id, ...updateClienteDto});

    if (!existingClient) {
      throw new NotFoundException(`Cliente com o ID ${id} não encontrado!`)
    }

    return this.clienteRepo.save(existingClient)
  }

  remove(id: number) {
    return this.clienteRepo.delete(id);
  }
}
