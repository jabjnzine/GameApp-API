import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryGameDto } from './create-category_game.dto';

export class UpdateCategoryGameDto extends PartialType(CreateCategoryGameDto) {}
