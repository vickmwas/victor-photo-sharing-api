import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { Photo } from './entities/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Hashtag } from 'src/hashtags/entities/hashtag.entity';
import { HashtagsModule } from 'src/hashtags/hashtags.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Photo, User, Like, Comment, Hashtag]),
    HashtagsModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
