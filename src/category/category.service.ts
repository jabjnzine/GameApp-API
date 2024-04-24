import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { StatusType } from 'src/config/constants';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async update(id: string, updateUserDto: UpdateCategoryDto) {
    const productCate = await this.getOne(id);

    try {
      const result = await this.categoryRepository.update(
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

  async paginate(options: IPaginationOptions): Promise<Pagination<Category>> {
    const qb = await this.findAll();

    return paginate<Category>(qb, options);
  }

  async findAll() {
    const qb = this.categoryRepository.createQueryBuilder('categories');
    qb.orderBy('categories.name', 'ASC');
    qb.where('categories.status = :status', { status: StatusType.ACTIVE });
    return qb;
  }

  async create(createDto: CreateCategoryDto): Promise<Category> {
    const result = await this.categoryRepository.save(createDto);
    return result;
  }

  async getOne(id: string): Promise<Category> {
    const qb = this.categoryRepository.createQueryBuilder('pc');
    // qb.orderBy('pc.name', 'ASC');
    qb.where('pc.id = :id', { id: id });
    const result = await qb.getOne();

    if (!result) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
