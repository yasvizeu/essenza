import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, Request } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { UpdateEmailDto, UpdatePasswordDto, UpdateCelularDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  // Endpoints para configurações do perfil
  @UseGuards(JwtAuthGuard)
  @Patch('alterar-email')
  alterarEmail(@Request() req: any, @Body() updateEmailDto: UpdateEmailDto) {
    this.logger.log(`Alterando email do cliente ${req.user.id}`);
    return this.clientesService.alterarEmail(req.user.id, updateEmailDto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('alterar-senha')
  alterarSenha(@Request() req: any, @Body() updatePasswordDto: UpdatePasswordDto) {
    this.logger.log(`Alterando senha do cliente ${req.user.id}`);
    return this.clientesService.alterarSenha(req.user.id, updatePasswordDto.senhaAtual, updatePasswordDto.novaSenha);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('alterar-celular')
  alterarCelular(@Request() req: any, @Body() updateCelularDto: UpdateCelularDto) {
    this.logger.log(`Alterando celular do cliente ${req.user.id}`);
    return this.clientesService.alterarCelular(req.user.id, updateCelularDto.cell);
  }
}
