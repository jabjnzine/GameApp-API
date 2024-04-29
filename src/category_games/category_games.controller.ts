import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryGamesService } from './category_games.service';
import { CreateCategoryGameDto } from './dto/create-category_game.dto';
import { UpdateCategoryGameDto } from './dto/update-category_game.dto';

@Controller('category-games')
export class CategoryGamesController {
  constructor(private readonly categoryGamesService: CategoryGamesService) {}

  @Post()
  create(@Body() createCategoryGameDto: CreateCategoryGameDto) {
    return this.categoryGamesService.create(createCategoryGameDto);
  }

  @Get()
  findAll() {
    return this.categoryGamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryGamesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryGameDto: UpdateCategoryGameDto) {
    return this.categoryGamesService.update(+id, updateCategoryGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryGamesService.remove(+id);
  }
}
