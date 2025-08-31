import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import {Repository} from 'typeorm';

@Injectable()
export class ProdutosService {

  constructor(
    @InjectRepository(Produto)
    private produtosRepository: Repository<Produto>,
  ) {}

  create(createProdutoDto: CreateProdutoDto) {
    const produto = this.produtosRepository.create(createProdutoDto);
    return this.produtosRepository.save(produto);
  }

  findAll() {
    return this.produtosRepository.find();
  }

  findOne(id: number) {
    return this.produtosRepository.findOneBy({ id });
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    const existingProduto = await this.produtosRepository.preload({ id: id, ...updateProdutoDto });

    if (!existingProduto) {
      throw new NotFoundException(`Produto com o ID ${id} não encontrado!`);
    }

    return this.produtosRepository.save(existingProduto);
  }

  remove(id: number) {
    return this.produtosRepository.delete(id);
  }
}
