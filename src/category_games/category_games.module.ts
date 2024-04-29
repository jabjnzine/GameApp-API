import { Module } from '@nestjs/common';
import { CategoryGamesService } from './category_games.service';
import { CategoryGamesController } from './category_games.controller';

@Module({
  controllers: [CategoryGamesController],
  providers: [CategoryGamesService],
})
export class CategoryGamesModule {}
