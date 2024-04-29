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
import { v4 as uuidv4 } from 'uuid';
import * as memeTypes from 'mime-types';
import { ConfigApp } from 'src/config/config';
import { S3StorageService } from 'src/aws/s3storage.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly s3StorageService: S3StorageService,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async updateStatus(id: string) {
    const cate = await this.getOne(id);

    try {
      const result = await this.categoryRepository.update(cate.id, {
        status:
          cate.status === StatusType.ACTIVE
            ? StatusType.INACTIVE
            : StatusType.ACTIVE,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
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
    const result = await paginate<Category>(qb, options);
    result.items.map((item: any) => {
      item.image = this.s3StorageService.urlBuilder(item.image);
    });
    return result;
  }

  async findAll() {
    const qb = this.categoryRepository.createQueryBuilder('categories');
    qb.orderBy('categories.name', 'ASC');
    // qb.where('categories.status = :status', { status: StatusType.ACTIVE });
    return qb;
  }

  async create(createDto: CreateCategoryDto): Promise<Category> {
    const result = await this.categoryRepository.save(createDto);
    return result;
  }
  async findOne(id: string) {
    return await this.getOne(id);
  }
  async getOne(id: string): Promise<Category> {
    const qb = this.categoryRepository.createQueryBuilder('cate');
    // qb.orderBy('pc.name', 'ASC');
    qb.where('cate.id = :id', { id: id });
    const result = await qb.getOne();

    if (!result) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async uploads(files: Object) {
    console.log(files);
    const filePaths = [];
    Object.values(files).forEach(async (file) => {
      const uuid = uuidv4();
      const ext = memeTypes.extension(file.mimetype);
      const filePath = `category/${uuid}.${ext}`;
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
}
