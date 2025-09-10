import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class AdicionarAoCarrinhoDto {
  @IsNotEmpty()
  @IsNumber()
  servicoId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantidade: number;
}

export class AtualizarCarrinhoDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantidade: number;
}

export class CarrinhoResponseDto {
  id: number;
  servicoId: number;
  servico: {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao?: number;
    categoria?: string;
  };
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CarrinhoResumoDto {
  items: CarrinhoResponseDto[];
  total: number;
  totalItems: number;
}
