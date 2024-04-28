import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import {
  FilesInterceptor,
  MemoryStorageFile,
  UploadedFiles,
} from '@blazity/nest-file-fastify';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ConfigApp } from 'src/config/config';
import { Game } from './entities/game.entity';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('size', new DefaultValuePipe(ConfigApp.itemPerPage), ParseIntPipe)
    limit: number = ConfigApp.itemPerPage,
  ): Promise<Pagination<Game>> {
    return this.gamesService.paginate({
      page: page,
      limit: limit,
    });
  }

  @Get('options')
  getOptions(): Promise<Game[]> {
    return this.gamesService.getOptions();
  }

  @Post('')
  create(@Body() createUserDto: CreateGameDto) {
    return this.gamesService.create(createUserDto);
  }

  @Post('/uploads')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploads(
    @UploadedFiles()
    files: {
      files?: MemoryStorageFile;
    },
  ): Promise<any> {
    return await this.gamesService.uploads(files);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: CreateGameDto,
    @Request() req,
  ) {
    return this.gamesService.update(id, updateUserDto);
  }
}
