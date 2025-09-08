import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('/clientes')
export class ClientesController {
  private readonly logger = new Logger(ClientesController.name);

  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    this.logger.log('Creating cliente');
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll() {
    this.logger.log('Finding all clientes');
    const result = this.clientesService.findAll();
    this.logger.log(`Result: ${JSON.stringify(result)}`);
    return result;
  }

  @Get('test')
  test() {
    this.logger.log('Test route called');
    return { message: 'Clientes test route working', timestamp: new Date().toISOString() };
  }

  @Get('verificar-cpf/:cpf')
  verificarCpfExistente(@Param('cpf') cpf: string) {
    this.logger.log(`Verificando CPF: ${cpf}`);
    return this.clientesService.verificarCpfExistente(cpf);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Finding cliente with id: ${id}`);
    return this.clientesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    this.logger.log(`Updating cliente with id: ${id}`);
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing cliente with id: ${id}`);
    return this.clientesService.remove(+id);
  }
}
