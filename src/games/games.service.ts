import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { v4 as uuidv4 } from 'uuid';
import * as memeTypes from 'mime-types';
import { ConfigService } from '@nestjs/config';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Repository } from 'typeorm';
import { StatusType } from 'src/config/constants';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { ConfigApp } from 'src/config/config';
import { S3StorageService } from 'src/aws/s3storage.service';
@Injectable()
export class GamesService {
  constructor(
    private readonly s3StorageService: S3StorageService,
    // private readonly s3StorageService: S3StorageService,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async uploads(files: Object) {
    console.log(files);
    const filePaths = [];
    Object.values(files).forEach(async (file) => {
      const uuid = uuidv4();
      const ext = memeTypes.extension(file.mimetype);
      const filePath = `games/${uuid}.${ext}`;
      filePaths.push({
        file_path: filePath,
        full_url: `${ConfigApp.aws_s3_url}/${filePath}`,
      });
      await this.s3StorageService.uploadFile(file, filePath);
    });
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Upload successful');
        resolve(filePaths);
      }, 500); // wait for s3 publish
    });
  }

  async updateStatus(id: string) {
    const game = await this.getOne(id);

    try {
      const result = await this.gameRepository.update(game.id, {
        status:
          game.status === StatusType.ACTIVE
            ? StatusType.INACTIVE
            : StatusType.ACTIVE,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
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
    const qb = this.gameRepository.createQueryBuilder('games');
    qb.orderBy('games.name', 'ASC');
    qb.where('games.status = :status', { status: StatusType.ACTIVE });
    return qb;
  }

  async findByIdCategories(category_id: number) {
    const qb = this.gameRepository.createQueryBuilder('games');
    qb.orderBy('games.name', 'ASC');
    // qb.where('games.status = :status', { status: StatusType.ACTIVE });
    qb.andWhere('games.category_id = :category_id', { category_id });
    const result = await qb.getMany();
    result.map((item: any) => {
      item.image = this.s3StorageService.urlBuilder(item.image);
    });
    return result;
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
