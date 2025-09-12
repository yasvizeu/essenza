import { Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Servico } from './entities/servico.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicosService {
  constructor(
    @InjectRepository(Servico)
    private servicoRepo: Repository<Servico>,
  ) {}

  create(createServicoDto: CreateServicoDto) {
    const newServico = this.servicoRepo.create(createServicoDto);
    return this.servicoRepo.save(newServico);
  }

  async findAll(page: number = 1, limit: number = 20, categoria?: string) {
    const skip = (page - 1) * limit;
    
    // Query builder para otimizar a consulta
    const queryBuilder = this.servicoRepo
      .createQueryBuilder('servico')
      .select([
        'servico.id',
        'servico.nome', 
        'servico.descricao',
        'servico.preco',
        'servico.categoria',
        'servico.duracao',
        'servico.imagem'
      ])
      .where('servico.disponivel = :disponivel', { disponivel: true })
      .skip(skip)
      .take(limit)
      .orderBy('servico.nome', 'ASC');

    // Filtro por categoria se fornecido
    if (categoria) {
      queryBuilder.andWhere('servico.categoria = :categoria', { categoria });
    }

    const [servicos, total] = await queryBuilder.getManyAndCount();

    return {
      data: servicos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  findOne(id: number) {
    return this.servicoRepo.findOneBy({ id });
  }

  async update(id: number, updateServicoDto: UpdateServicoDto) {
    const existingServico = await this.servicoRepo.preload({ id, ...updateServicoDto });
    if (!existingServico) {
      throw new Error(`Serviço com o ID ${id} não encontrado!`);
    }
    return this.servicoRepo.save(existingServico);
  }

  remove(id: number) {
    return this.servicoRepo.delete(id);
  }
}
