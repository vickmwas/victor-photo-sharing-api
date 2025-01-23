import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PhotosService } from './photos.service';
import { Photo } from './entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('PhotosService', () => {
  let service: PhotosService;
  let mockPhotoRepository: Partial<Repository<Photo>>;
  let mockUserRepository: Partial<Repository<User>>;
  let mockLikeRepository: Partial<Repository<Like>>;
  let mockCommentRepository: Partial<Repository<Comment>>;

  const mockUser = {
    id: 'user1',
    username: 'testuser',
    following: [],
  };

  const mockPhoto = {
    id: '1',
    photoUrl: 'test.jpg',
    caption: 'Test photo #test',
    user: mockUser,
    likes: [],
    comments: [],
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockUserRepository = {
      findOneOrFail: jest.fn().mockResolvedValue(mockUser),
      findOne: jest.fn().mockResolvedValue(mockUser),
    };

    mockPhotoRepository = {
      create: jest.fn().mockReturnValue(mockPhoto),
      save: jest.fn().mockResolvedValue(mockPhoto),
      findOne: jest.fn().mockResolvedValue(mockPhoto),
      find: jest.fn().mockResolvedValue([mockPhoto]),
    };

    mockLikeRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      save: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
    };

    mockCommentRepository = {
      count: jest.fn().mockResolvedValue(0),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: getRepositoryToken(Photo),
          useValue: mockPhotoRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Like),
          useValue: mockLikeRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: HashtagsService,
          useValue: {
            extractHashtags: jest.fn().mockReturnValue(['test']),
            findOrCreateHashtags: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            createNotification: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new photo', async () => {
      const result = await service.create(
        {
          photoUrl: 'test.jpg',
          caption: 'Test photo',
          filename: 'test.jpg',
          size: 100,
          mimeType: 'image/jpeg',
        },
        'user1',
      );

      expect(result).toEqual(mockPhoto);
    });
  });

  describe('findOne', () => {
    it('should return a photo by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockPhoto);
    });
  });

  describe('likePhoto', () => {
    it('should like a photo', async () => {
      await service.likePhoto('1', 'user2');
      expect(mockLikeRepository.create).toHaveBeenCalled();
    });
  });
});
