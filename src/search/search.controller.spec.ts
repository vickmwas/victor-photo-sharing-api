import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Photo } from '../photos/entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { Repository } from 'typeorm';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;
  let mockPhotoRepository: Partial<Repository<Photo>>;
  let mockUserRepository: Partial<Repository<User>>;
  let mockHashtagRepository: Partial<Repository<Hashtag>>;

  const mockPhoto = {
    id: '1',
    photoUrl: 'test.jpg',
    caption: 'Test photo #test',
    user: { id: 'user1', username: 'testuser' },
    likes: [],
    comments: [],
    hashtags: [{ hashtag: '#test' }],
    createdAt: new Date(),
    likeCount: 0,
    commentCount: 0,
  };

  const mockUser = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockHashtag = {
    id: '1',
    hashtag: '#test',
    photos: [mockPhoto],
  };

  const mockQueryBuilder = {
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockPhoto], 1]),
  };

  beforeEach(async () => {
    mockPhotoRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockUserRepository = {
      find: jest.fn().mockResolvedValue([mockUser]),
      findAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
    };

    mockHashtagRepository = {
      find: jest.fn().mockResolvedValue([mockHashtag]),
      findAndCount: jest.fn().mockResolvedValue([[mockHashtag], 1]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        SearchService,
        {
          provide: getRepositoryToken(Photo),
          useValue: mockPhotoRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Hashtag),
          useValue: mockHashtagRepository,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should search by hashtag', async () => {
      const result = await controller.search({
        query: '#test',
        page: 1,
        limit: 10,
      });
      expect(result.data).toEqual([mockPhoto]);
      expect(result.meta.totalItems).toBe(1);
    });

    it('should search by username', async () => {
      const result = await controller.search({
        query: 'testuser',
        page: 1,
        limit: 10,
      });
      expect(result.data).toEqual([mockPhoto]);
      expect(result.meta.totalItems).toBe(1);
    });
  });
});
