import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FichaAnamneseService } from './ficha-anamnese.service';
import { CreateFichaAnamneseDto } from './dto/create-ficha-anamnese.dto';
import { UpdateFichaAnamneseDto } from './dto/update-ficha-anamnese.dto';

@Controller('fichas')
export class FichaAnamneseController {
  constructor(private readonly fichaAnamneseService: FichaAnamneseService) {}

  @Post()
  create(@Body() createFichaAnamneseDto: CreateFichaAnamneseDto) {
    return this.fichaAnamneseService.create(createFichaAnamneseDto);
  }

  @Get()
  findAll() {
    return this.fichaAnamneseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fichaAnamneseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFichaAnamneseDto: UpdateFichaAnamneseDto) {
    return this.fichaAnamneseService.update(+id, updateFichaAnamneseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fichaAnamneseService.remove(+id);
  }
}
