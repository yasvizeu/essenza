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
    const salvo = await this.agendamentosRepository.save(agendamento);
    return await this.agendamentosRepository.findOneOrFail({
      where: { id: salvo.id },
      relations: ['cliente', 'profissional', 'servico'],
    });
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
    
    // Validar se pode editar (até 24h antes do agendamento)
    const agora = new Date();
    const dataAgendamento = new Date(agendamento.startDateTime);
    const diferencaHoras = (dataAgendamento.getTime() - agora.getTime()) / (1000 * 60 * 60);
    
    if (diferencaHoras < 24) {
      throw new Error('Não é possível editar agendamentos com menos de 24 horas de antecedência');
    }
    
    // Verificar disponibilidade se a data/hora mudou
    if (updateAgendamentoDto.startDateTime || updateAgendamentoDto.endDateTime) {
      const novaDataInicio = updateAgendamentoDto.startDateTime 
        ? new Date(updateAgendamentoDto.startDateTime) 
        : agendamento.startDateTime;
      const novaDataFim = updateAgendamentoDto.endDateTime 
        ? new Date(updateAgendamentoDto.endDateTime) 
        : agendamento.endDateTime;
      
      const disponivel = await this.verificarDisponibilidade(
        agendamento.profissionalId,
        novaDataInicio,
        novaDataFim,
        id
      );
      
      if (!disponivel) {
        throw new Error('Horário não disponível para o profissional selecionado');
      }
    }
    
    Object.assign(agendamento, updateAgendamentoDto);
    const salvo = await this.agendamentosRepository.save(agendamento);
    return await this.agendamentosRepository.findOneOrFail({
      where: { id: salvo.id },
      relations: ['cliente', 'profissional', 'servico'],
    });
  }

  async confirmar(id: number): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    agendamento.status = 'confirmed';
    const salvo = await this.agendamentosRepository.save(agendamento);
    return await this.agendamentosRepository.findOneOrFail({
      where: { id: salvo.id },
      relations: ['cliente', 'profissional', 'servico'],
    });
  }

  // Confirmar agendamento de serviço pago (mudar de tentative para confirmed)
  async confirmarAgendamentoPago(id: number, startDateTime: string, endDateTime: string, profissionalId: number): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    
    // Verificar se é um agendamento pago e tentative
    if (agendamento.statusPagamento !== 'pago' || agendamento.status !== 'tentative') {
      throw new Error('Apenas agendamentos pagos e pendentes podem ser confirmados');
    }
    
    // Verificar disponibilidade
    const disponivel = await this.verificarDisponibilidade(
      profissionalId,
      new Date(startDateTime),
      new Date(endDateTime),
      id
    );
    
    if (!disponivel) {
      throw new Error('Horário não disponível para o profissional selecionado');
    }
    
    // Atualizar dados do agendamento
    agendamento.startDateTime = new Date(startDateTime);
    agendamento.endDateTime = new Date(endDateTime);
    agendamento.profissionalId = profissionalId;
    agendamento.status = 'confirmed';
    agendamento.title = agendamento.servico?.nome || agendamento.title;
    
    console.log('🔍 Debug - Confirmando agendamento pago:', {
      id: agendamento.id,
      status: agendamento.status,
      statusPagamento: agendamento.statusPagamento,
      startDateTime: agendamento.startDateTime,
      servicoNome: agendamento.servico?.nome
    });
    
    const salvo = await this.agendamentosRepository.save(agendamento);
    return await this.agendamentosRepository.findOneOrFail({
      where: { id: salvo.id },
      relations: ['cliente', 'profissional', 'servico'],
    });
  }

  async cancelar(id: number, motivo?: string): Promise<Agendamento> {
    const agendamento = await this.findOne(id);
    
    // Se for um agendamento confirmado pago, voltar para tentative
    if (agendamento.status === 'confirmed' && agendamento.statusPagamento === 'pago') {
      agendamento.status = 'tentative';
      console.log('🔍 Debug - Agendamento cancelado voltou para tentative:', {
        id: agendamento.id,
        status: agendamento.status,
        statusPagamento: agendamento.statusPagamento
      });
    } else {
      agendamento.status = 'cancelled';
    }
    
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
    console.log('🔍 Backend - Buscando serviços pagos não agendados para cliente ID:', clienteId);
    
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

    console.log('🔍 Backend - Agendamentos pagos tentative encontrados:', agendamentosPagos.length);
    console.log('🔍 Backend - Detalhes dos agendamentos:', agendamentosPagos.map(a => ({
      id: a.id,
      status: a.status,
      statusPagamento: a.statusPagamento,
      servicoNome: a.servico?.nome
    })));

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

    const resultado = Array.from(servicosUnicos.values());
    console.log('🔍 Backend - Serviços únicos retornados:', resultado.length);
    console.log('🔍 Backend - Serviços:', resultado.map(s => ({ id: s.id, nome: s.nome, agendamentoId: s.agendamentoId })));

    return resultado;
  }
}
