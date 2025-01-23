import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Repository } from 'typeorm';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;
  let mockCommentRepository: Partial<Repository<Comment>>;
  let mockNotificationsService: Partial<NotificationsService>;

  const mockComment = {
    id: '1',
    text: 'Test comment',
    user: { id: 'user1' },
    photo: { id: 'photo1' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockCommentRepository = {
      findOne: jest.fn().mockResolvedValue(mockComment),
      save: jest.fn().mockResolvedValue(mockComment),
      create: jest.fn().mockReturnValue(mockComment),
    };

    mockNotificationsService = {
      createNotification: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
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

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases here
});
