import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Protocolo } from './entities/protocolo.entity';
import { ProtocoloServico as Pivot } from './entities/protocolo-servico.entity';
import { Servico as Svc } from '../servicos/entities/servico.entity';
import { UpdateProtocoloStepsDto } from './dto/update-protocolo-steps.dto';

@Injectable()
export class ProtocolosService {
  constructor(
    @InjectRepository(Protocolo) private readonly protocolRepo: Repository<Protocolo>,
    @InjectRepository(Pivot) private readonly pivotRepo: Repository<Pivot>,
    @InjectRepository(Svc) private readonly svcRepo: Repository<Svc>,
    private readonly dataSource: DataSource,
  ) {}

  create(nome: string, notas?: string) {
    return this.protocolRepo.save(this.protocolRepo.create({ nome, observacoes: notas }));
  }

  async findOneWithSteps(id: number) {
  return this.protocolRepo
    .createQueryBuilder('p')
    .leftJoinAndSelect('p.steps', 'ps')
    .leftJoinAndSelect('ps.servico', 's')
    .where('p.id = :id', { id })
    .orderBy('ps.ordem', 'ASC')   // aqui ordena pelos passos
    .getOne();
  }

  async updateSteps(protocolId: number, dto: UpdateProtocoloStepsDto) {
    await this.protocolRepo.findOneByOrFail({ id: protocolId });

    const svcIds = dto.steps.map((s) => s.servicoId);
    const found = await this.svcRepo.findBy({ id: In(svcIds) });
    if (found.length !== svcIds.length) {
      throw new Error('Serviço inválido na lista.');
    }

    return this.dataSource.transaction(async (manager) => {
      const pivotRepo = manager.getRepository(Pivot);

      // Estratégia simples e segura: limpa e reinsere
      await pivotRepo
        .createQueryBuilder()
        .delete()
        .where('protocoloId = :id', { id: protocolId }) // <- ajustado
        .execute();

      const rows = dto.steps.map((s) =>
        pivotRepo.create({
          protocolo: { id: protocolId },
          servico: { id: s.servicoId },
          ordem: s.ordem,
          duracaoMin: s.duracaoMin,
        }),
      );

      await pivotRepo.save(rows);
      return this.findOneWithSteps(protocolId);
    });
  }

  remove(id: number) {
    return this.protocolRepo.delete(id);
  }
}
