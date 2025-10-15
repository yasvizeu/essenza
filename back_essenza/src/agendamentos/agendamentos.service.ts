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
  // Cria o agendamento
  const agendamento = this.agendamentosRepository.create({
    ...createAgendamentoDto,
    status: 'confirmed', // ou 'scheduled' dependendo da sua convenção
    statusPagamento: 'pago' // opcional, se o pagamento já estiver confirmado
  });

  const salvo = await this.agendamentosRepository.save(agendamento);

  return salvo;
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

  // Buscar serviços pagos não agendados para um cliente
  async findServicosPagosNaoAgendados(clienteId: number): Promise<any[]> {
    // Buscar agendamentos pagos do cliente que ainda são tentative (não agendados)
    const agendamentosPagos = await this.agendamentosRepository.find({
      where: {
        clienteId: clienteId,
        statusPagamento: 'pago',
        status: 'tentative'  // Apenas os que ainda não foram agendados
      },
      relations: ['servico'],
      order: { createdAt: 'DESC' }
    });

    // Retornar apenas os serviços únicos (sem duplicatas)
    const servicosUnicos = new Map();
    
    agendamentosPagos.forEach(agendamento => {
      if (agendamento.servico && !servicosUnicos.has(agendamento.servico.id)) {
        servicosUnicos.set(agendamento.servico.id, {
          id: agendamento.servico.id,
          nome: agendamento.servico.nome,
          descricao: agendamento.servico.descricao,
          preco: agendamento.servico.preco,
          duracao: agendamento.servico.duracao,
          categoria: agendamento.servico.categoria,
          imagem: agendamento.servico.imagem,
          disponivel: agendamento.servico.disponivel,
          dataPagamento: agendamento.createdAt,
          agendamentoId: agendamento.id
        });
      }
    });

    return Array.from(servicosUnicos.values());
  }
}
