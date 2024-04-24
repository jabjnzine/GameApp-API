import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ConfigApp } from 'src/config/config';
import { Category } from './entities/category.entity';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('size', new DefaultValuePipe(ConfigApp.itemPerPage), ParseIntPipe)
    limit: number = ConfigApp.itemPerPage,
  ): Promise<Pagination<Category>> {
    return this.categoryService.paginate({
      page: page,
      limit: limit,
    });
  }

  @Get('options')
  getOptions(): Promise<Category[]> {
    return this.categoryService.getOptions();
  }

  @Post('')
  create(@Body() createUserDto: CreateCategoryDto) {
    return this.categoryService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: CreateCategoryDto,
    @Request() req,
  ) {
    return this.categoryService.update(id, updateUserDto);
  }
}
