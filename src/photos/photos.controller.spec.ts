import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { Photo } from './entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

describe('PhotosController', () => {
  let controller: PhotosController;
  let service: PhotosService;
  let mockPhotoRepository: Partial<Repository<Photo>>;
  let mockUserRepository: Partial<Repository<User>>;
  let mockLikeRepository: Partial<Repository<Like>>;
  let mockCommentRepository: Partial<Repository<Comment>>;

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

  beforeEach(async () => {
    mockUserRepository = {
      findOneOrFail: jest.fn().mockResolvedValue(mockPhoto.user),
      findOne: jest.fn().mockResolvedValue(mockPhoto.user),
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
      controllers: [PhotosController],
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

    controller = module.get<PhotosController>(PhotosController);
    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases here
});
