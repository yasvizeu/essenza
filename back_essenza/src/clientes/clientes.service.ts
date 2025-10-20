import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

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

  // Métodos para configurações do perfil
  async alterarEmail(clienteId: number, novoEmail: string): Promise<{ message: string; cliente: Partial<Cliente> }> {
    const cliente = await this.clienteRepo.findOne({ where: { id: clienteId } });
    
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Verificar se o email já existe
    const emailExistente = await this.clienteRepo.findOne({ where: { email: novoEmail } });
    if (emailExistente && emailExistente.id !== clienteId) {
      throw new ConflictException('Este email já está em uso por outro cliente');
    }

    // Atualizar email
    await this.clienteRepo.update(clienteId, { email: novoEmail });

    // Buscar cliente atualizado
    const clienteAtualizado = await this.clienteRepo.findOne({ where: { id: clienteId } });
    const clienteSemSenha = clienteAtualizado ? (({ password, ...rest }) => rest)(clienteAtualizado as any) : {};

    return {
      message: 'Email alterado com sucesso',
      cliente: clienteSemSenha
    };
  }

  async alterarSenha(clienteId: number, senhaAtual: string, novaSenha: string): Promise<{ message: string }> {
    const cliente = await this.clienteRepo.findOne({ where: { id: clienteId } });
    
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, (cliente as any).password);
    if (!senhaValida) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    await this.clienteRepo.update(clienteId, { password: novaSenhaHash });

    return {
      message: 'Senha alterada com sucesso'
    };
  }

  async alterarCelular(clienteId: number, novoCelular: string): Promise<{ message: string; cliente: Partial<Cliente> }> {
    const cliente = await this.clienteRepo.findOne({ where: { id: clienteId } });
    
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Atualizar celular
    await this.clienteRepo.update(clienteId, { cell: novoCelular });

    // Buscar cliente atualizado
    const clienteAtualizado = await this.clienteRepo.findOne({ where: { id: clienteId } });
    const clienteSemSenha = clienteAtualizado ? (({ password, ...rest }) => rest)(clienteAtualizado as any) : {};

    return {
      message: 'Celular alterado com sucesso',
      cliente: clienteSemSenha
    };
  }
}
