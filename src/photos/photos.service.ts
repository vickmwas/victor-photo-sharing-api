import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
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
      user: user.id,
    });
    return this.photosRepository.save(photo);
  }

  findAll() {
    return `This action returns all photos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} photo`;
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return `This action updates a #${id} photo`;
  }

  remove(id: number) {
    return `This action removes a #${id} photo`;
  }
}
