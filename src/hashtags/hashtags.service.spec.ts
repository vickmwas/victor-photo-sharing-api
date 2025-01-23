import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashtagsService } from './hashtags.service';
import { Hashtag } from './entities/hashtag.entity';

describe('HashtagsService', () => {
  let service: HashtagsService;
  let mockHashtagRepository: Partial<Repository<Hashtag>>;

  const mockHashtag = {
    id: '1',
    hashtag: '#test',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockHashtagRepository = {
      create: jest.fn().mockReturnValue(mockHashtag),
      save: jest.fn().mockResolvedValue(mockHashtag),
      findOne: jest.fn().mockResolvedValue(mockHashtag),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashtagsService,
        {
          provide: getRepositoryToken(Hashtag),
          useValue: mockHashtagRepository,
        },
      ],
    }).compile();

    service = module.get<HashtagsService>(HashtagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractHashtags', () => {
    it('should extract hashtags from text', () => {
      const text = 'This is a #test with #multiple #hashtags';
      const result = service.extractHashtags(text);
      expect(result).toEqual(['#test', '#multiple', '#hashtags']);
    });

    it('should return empty array when no hashtags', () => {
      const text = 'This is a text without hashtags';
      const result = service.extractHashtags(text);
      expect(result).toEqual([]);
    });
  });

  describe('findOrCreateHashtags', () => {
    it('should find existing hashtag', async () => {
      const hashtags = ['#test'];
      const result = await service.findOrCreateHashtags(hashtags);
      expect(result).toEqual([mockHashtag]);
      expect(mockHashtagRepository.findOne).toHaveBeenCalled();
    });
  });
});
