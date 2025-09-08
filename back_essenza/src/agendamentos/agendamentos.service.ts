import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento } from './entities/agendamento.entity';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private agendamentosRepository: Repository<Agendamento>,
  ) {}

  async create(createAgendamentoDto: CreateAgendamentoDto): Promise<Agendamento> {
    const agendamento = this.agendamentosRepository.create(createAgendamentoDto);
    return await this.agendamentosRepository.save(agendamento);
  }

  async findAll(): Promise<Agendamento[]> {
    return await this.agendamentosRepository.find({
      relations: ['cliente', 'profissional', 'servico'],
      order: { startDateTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Agendamento> {
    const agendamento = await this.agendamentosRepository.findOne({
      where: { id },
      relations: ['cliente', 'profissional', 'servico'],
    });

    if (!agendamento) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }

    return agendamento;
  }

  async findByCliente(clienteId: number): Promise<Agendamento[]> {
    return await this.agendamentosRepository.find({
      where: { clienteId },
      relations: ['cliente', 'profissional', 'servico'],
      order: { startDateTime: 'ASC' },
    });
  }

  async findByProfissional(profissionalId: number): Promise<Agendamento[]> {
    return await this.agendamentosRepository.find({
      where: { profissionalId },
      relations: ['cliente', 'profissional', 'servico'],
      order: { startDateTime: 'ASC' },
    });
  }

  async update(id: number, updateAgendamentoDto: UpdateAgendamentoDto): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    
    Object.assign(agendamento, updateAgendamentoDto);
    return await this.agendamentosRepository.save(agendamento);
  }

  async confirmar(id: number): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    agendamento.status = 'confirmed';
    return await this.agendamentosRepository.save(agendamento);
  }

  async cancelar(id: number, motivo?: string): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    agendamento.status = 'cancelled';
    if (motivo) {
      agendamento.observacoes = agendamento.observacoes 
        ? `${agendamento.observacoes}\nCancelado: ${motivo}`
        : `Cancelado: ${motivo}`;
    }
    return await this.agendamentosRepository.save(agendamento);
  }

  async remove(id: number): Promise<void> {
    const agendamento = await this.findOne(id);
    await this.agendamentosRepository.remove(agendamento);
  }

  // Métodos auxiliares para verificar disponibilidade
  async verificarDisponibilidade(
    profissionalId: number,
    startDateTime: Date,
    endDateTime: Date,
    agendamentoId?: number
  ): Promise<boolean> {
    const query = this.agendamentosRepository
      .createQueryBuilder('agendamento')
      .where('agendamento.profissionalId = :profissionalId', { profissionalId })
      .andWhere('agendamento.status != :status', { status: 'cancelled' })
      .andWhere(
        '(agendamento.startDateTime < :endDateTime AND agendamento.endDateTime > :startDateTime)',
        { startDateTime, endDateTime }
      );

    if (agendamentoId) {
      query.andWhere('agendamento.id != :agendamentoId', { agendamentoId });
    }

    const conflitos = await query.getCount();
    return conflitos === 0;
  }

  // Buscar agendamentos por período
  async findByPeriodo(
    startDate: Date,
    endDate: Date,
    profissionalId?: number
  ): Promise<Agendamento[]> {
    const query = this.agendamentosRepository
      .createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.cliente', 'cliente')
      .leftJoinAndSelect('agendamento.profissional', 'profissional')
      .leftJoinAndSelect('agendamento.servico', 'servico')
      .where('agendamento.startDateTime >= :startDate', { startDate })
      .andWhere('agendamento.startDateTime <= :endDate', { endDate })
      .orderBy('agendamento.startDateTime', 'ASC');

    if (profissionalId) {
      query.andWhere('agendamento.profissionalId = :profissionalId', { profissionalId });
    }

    return await query.getMany();
  }
}
