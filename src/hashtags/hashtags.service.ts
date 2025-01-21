import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
  ) {}

  async findOrCreateHashtags(hashtags: string[]): Promise<Hashtag[]> {
    const uniqueHashtags = [...new Set(hashtags)];
    const hashtagEntities: Hashtag[] = [];

    for (const tag of uniqueHashtags) {
      const hashtagWithSymbol = tag.startsWith('#') ? tag : `#${tag}`;
      let hashtag = await this.hashtagRepository.findOne({
        where: { hashtag: hashtagWithSymbol },
      });

      if (!hashtag) {
        hashtag = await this.hashtagRepository.save({
          hashtag: hashtagWithSymbol,
        });
      }

      hashtagEntities.push(hashtag);
    }

    return hashtagEntities;
  }

  extractHashtags(text: string): string[] {
    const hashtagRegex = /#\w+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches : [];
  }
}
