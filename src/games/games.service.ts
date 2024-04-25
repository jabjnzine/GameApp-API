import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { v4 as uuidv4 } from 'uuid';
import * as memeTypes from 'mime-types';
import { ConfigService } from '@nestjs/config';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Repository } from 'typeorm';
import { StatusType } from 'src/config/constants';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
@Injectable()
export class GamesService {
  constructor(
    private readonly configService: ConfigService,
    // private readonly s3StorageService: S3StorageService,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}
  async update(id: string, updateUserDto: UpdateGameDto) {
    const productCate = await this.getOne(id);

    try {
      const result = await this.gameRepository.update(
        productCate.id,
        updateUserDto,
      );
      return result;
    } catch (error) {
      return error;
    }
  }

  async getOptions() {
    const qb = await this.findAll();
    qb.select(['id', 'name']);
    qb.where("status = 'active'");
    const result = await qb.getRawMany();
    return result;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Game>> {
    const qb = await this.findAll();

    return paginate<Game>(qb, options);
  }

  async findAll() {
    const qb = this.gameRepository.createQueryBuilder('categories');
    qb.orderBy('categories.name', 'ASC');
    qb.where('categories.status = :status', { status: StatusType.ACTIVE });
    return qb;
  }

  async create(createDto: CreateCategoryDto): Promise<Category> {
    const result = await this.gameRepository.save(createDto);
    return result;
  }

  async getOne(id: string): Promise<Category> {
    const qb = this.gameRepository.createQueryBuilder('cate');
    // qb.orderBy('pc.name', 'ASC');
    qb.where('cate.id = :id', { id: id });
    const result = await qb.getOne();

    if (!result) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
