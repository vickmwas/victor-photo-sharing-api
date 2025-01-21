import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Photo } from '../photos/entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, User, Hashtag])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
