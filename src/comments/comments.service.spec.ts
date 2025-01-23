import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { NotificationsService } from '../notifications/notifications.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let mockCommentRepository: Partial<Repository<Comment>>;
  let mockNotificationsService: Partial<NotificationsService>;

  const mockComment = {
    id: '1',
    text: 'Test comment',
    user: { id: '1' },
    photo: { id: '1' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockCommentRepository = {
      create: jest.fn().mockReturnValue(mockComment),
      save: jest.fn().mockResolvedValue(mockComment),
      findOne: jest.fn().mockResolvedValue(mockComment),
      update: jest.fn().mockResolvedValue(true),
      softDelete: jest.fn().mockResolvedValue(true),
    };

    mockNotificationsService = {
      createNotification: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add test cases for create, update, delete operations
});
