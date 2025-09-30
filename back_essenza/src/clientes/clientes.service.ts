import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
    // Verificar se CPF já existe
    const existingClient = await this.clienteRepo.findOneBy({ cpf: dto.cpf });
    if (existingClient) {
      throw new ConflictException('Este CPF já possui cadastro');
    }

    // Verificar se email já existe
    const existingEmail = await this.clienteRepo.findOneBy({ email: dto.email });
    if (existingEmail) {
      throw new ConflictException('Este email já possui cadastro');
    }

    try {
      const newClient = this.clienteRepo.create(dto);
      return await this.clienteRepo.save(newClient);
    } catch (error) {
      // Se for erro de constraint única (duplicação)
      if (error.code === '23505') {
        if (error.detail.includes('cpf')) {
          throw new ConflictException('Este CPF já possui cadastro');
        } else if (error.detail.includes('email')) {
          throw new ConflictException('Este email já possui cadastro');
        }
      }
      throw new BadRequestException('Erro ao criar cliente');
    }
  }

  findAll() {
    return this.clienteRepo.find();
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

  async verificarCpfExistente(cpf: string): Promise<{ exists: boolean }> {
    const cliente = await this.clienteRepo.findOneBy({ cpf });
    return { exists: !!cliente };
  }
}
