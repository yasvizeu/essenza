import { Injectable } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Profissional } from '../profissional/entities/profissional.entity';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
  ) {}

  async login(email: string, password: string) {
    // Buscar cliente
    let user: Cliente | Profissional | null = await this.clienteRepository.findOne({ where: { email } });
    
    if (user && user.password === password) {
      return {
        success: true,
        user: user,
        type: 'cliente'
      };
    }

    // Buscar profissional
    user = await this.profissionalRepository.findOne({ where: { email } });
    
    if (user && user.password === password) {
      return {
        success: true,
        user: user,
        type: 'profissional'
      };
    }

    throw new Error('Credenciais inválidas');
  }

  create(createPersonaDto: CreatePersonaDto) {
    return 'This action adds a new persona';
  }

  async findAll() {
    const clientes = await this.clienteRepository.find();
    const profissionais = await this.profissionalRepository.find();
    return [...clientes, ...profissionais];
  }

  findOne(id: number) {
    return `This action returns a #${id} persona`;
  }

  update(id: number, updatePersonaDto: UpdatePersonaDto) {
    return `This action updates a #${id} persona`;
  }

  remove(id: number) {
    return `This action removes a #${id} persona`;
  }
}
