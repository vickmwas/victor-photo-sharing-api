import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HashtagsController } from './hashtags.controller';
import { HashtagsService } from './hashtags.service';
import { Hashtag } from './entities/hashtag.entity';
import { Repository } from 'typeorm';

describe('HashtagsController', () => {
  let controller: HashtagsController;
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
      findOne: jest.fn().mockResolvedValue(mockHashtag),
      save: jest.fn().mockResolvedValue(mockHashtag),
      create: jest.fn().mockReturnValue(mockHashtag),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HashtagsController],
      providers: [
        HashtagsService,
        {
          provide: getRepositoryToken(Hashtag),
          useValue: mockHashtagRepository,
        },
      ],
    }).compile();

    controller = module.get<HashtagsController>(HashtagsController);
    service = module.get<HashtagsService>(HashtagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases here
});
