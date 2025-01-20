import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { In, Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PhotosService {
  private s3: AWS.S3;

  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private configService: ConfigService,
  ) {
    this.s3 = new AWS.S3();
  }

  async uploadFile(file: Express.Multer.File): Promise<{
    photoUrl: string;
    filename: string;
    size: number;
    mimeType: string;
  }> {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get<string>('AWS_S3_PHOTOS_BUCKET_NAME'),
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read',
      })
      .promise();

    return {
      photoUrl: uploadResult.Location,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async create(createPhotoDto: CreatePhotoDto, userId: string): Promise<Photo> {
    if (!userId) {
      throw new BadRequestException('User ID must be provided');
    }

    const user = await this.usersRepository.findOneOrFail({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const photo = this.photosRepository.create({
      ...createPhotoDto,
      user,
    });
    return this.photosRepository.save(photo);
  }

  async findAllByUser(userId: string): Promise<Photo[]> {
    console.log('Testing Request: UserID');
    console.log(userId);
    return this.photosRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Photo> {
    const photo = await this.photosRepository.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    return photo;
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
    const photo = await this.photosRepository.preload({
      id,
      ...updatePhotoDto,
    });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    return this.photosRepository.save(photo);
  }

  async remove(id: string): Promise<void> {
    const photo = await this.photosRepository.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    await this.photosRepository.softRemove(photo);
  }

  async getUserFeed(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    photos: Photo[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const followingIds = user.following.map(
      (followingUser) => followingUser.id,
    );
    followingIds.push(userId);

    const [photos, totalItems] = await this.photosRepository.findAndCount({
      where: { user: { id: In(followingIds) } },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      photos,
      currentPage: page,
      totalPages,
      totalItems,
      perPage: limit,
    };
  }
}
