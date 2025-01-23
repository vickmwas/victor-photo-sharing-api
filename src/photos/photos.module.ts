import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { Photo } from './entities/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Photo, User, Like, Comment, Hashtag]),
    HashtagsModule,
    NotificationsModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
