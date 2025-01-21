import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../photos/entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { SearchParamsDto } from './dto/search-params.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  async search({ query, page = 1, limit = 10 }: SearchParamsDto) {
    const isHashtag = query.startsWith('#');
    const searchTerm = isHashtag ? query : query.toLowerCase();

    let photos;
    let total;
    let searchType;

    if (isHashtag) {
      [photos, total] = await this.photoRepository
        .createQueryBuilder('photo')
        .innerJoinAndSelect('photo.hashtags', 'hashtag')
        .innerJoinAndSelect('photo.user', 'user')
        .leftJoinAndSelect('photo.likes', 'likes')
        .leftJoinAndSelect('photo.comments', 'comments')
        .where('hashtag.hashtag = :hashtag', { hashtag: searchTerm })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      searchType = 'hashtag';
    } else {
      [photos, total] = await this.photoRepository
        .createQueryBuilder('photo')
        .innerJoinAndSelect('photo.user', 'user')
        .leftJoinAndSelect('photo.likes', 'likes')
        .leftJoinAndSelect('photo.comments', 'comments')
        .where('LOWER(user.username) LIKE :username', {
          username: `%${searchTerm}%`,
        })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      searchType = 'username';
    }

    return {
      data: photos.map((photo) => ({
        ...photo,
        likeCount: photo.likes.length,
        commentCount: photo.comments.length,
      })),
      meta: {
        searchType,
        query: searchTerm,
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
