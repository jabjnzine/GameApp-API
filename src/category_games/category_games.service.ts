import { Injectable } from '@nestjs/common';
import { CreateCategoryGameDto } from './dto/create-category_game.dto';
import { UpdateCategoryGameDto } from './dto/update-category_game.dto';

@Injectable()
export class CategoryGamesService {
  create(createCategoryGameDto: CreateCategoryGameDto) {
    return 'This action adds a new categoryGame';
  }

  findAll() {
    return `This action returns all categoryGames`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryGame`;
  }

  update(id: number, updateCategoryGameDto: UpdateCategoryGameDto) {
    return `This action updates a #${id} categoryGame`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryGame`;
  }
}
