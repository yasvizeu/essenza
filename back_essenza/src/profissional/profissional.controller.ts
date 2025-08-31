import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { ProfissionalService } from './profissional.service';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';

@Controller('profissionais')
export class ProfissionalController {
  private readonly logger = new Logger(ProfissionalController.name);

  constructor(private readonly profissionalService: ProfissionalService) {}

  @Post()
  create(@Body() createProfissionalDto: CreateProfissionalDto) {
    this.logger.log('Creating profissional');
    return this.profissionalService.create(createProfissionalDto);
  }

  @Get()
  findAll() {
    this.logger.log('Finding all profissionais');
    const result = this.profissionalService.findAll();
    this.logger.log(`Result: ${JSON.stringify(result)}`);
    return result;
  }

  @Get('test')
  test() {
    this.logger.log('Test route called');
    return { message: 'Profissionais test route working', timestamp: new Date().toISOString() };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Finding profissional with id: ${id}`);
    return this.profissionalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfissionalDto: UpdateProfissionalDto) {
    this.logger.log(`Updating profissional with id: ${id}`);
    return this.profissionalService.update(+id, updateProfissionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing profissional with id: ${id}`);
    return this.profissionalService.remove(+id);
  }
}
