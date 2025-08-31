import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Controller('servicos')
export class ServicosController {
  private readonly logger = new Logger(ServicosController.name);

  constructor(private readonly servicosService: ServicosService) {}

  @Post()
  create(@Body() createServicoDto: CreateServicoDto) {
    this.logger.log('Creating servico');
    return this.servicosService.create(createServicoDto);
  }

  @Get()
  findAll() {
    this.logger.log('Finding all servicos');
    const result = this.servicosService.findAll();
    this.logger.log(`Result: ${JSON.stringify(result)}`);
    return result;
  }

  @Get('test')
  test() {
    this.logger.log('Test route called');
    return { message: 'Servicos test route working', timestamp: new Date().toISOString() };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Finding servico with id: ${id}`);
    return this.servicosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    this.logger.log(`Updating servico with id: ${id}`);
    return this.servicosService.update(+id, updateServicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing servico with id: ${id}`);
    return this.servicosService.remove(+id);
  }
}
