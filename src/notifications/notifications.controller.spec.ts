import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;
  let mockNotificationRepository: Partial<Repository<Notification>>;

  const mockNotification = {
    id: '1',
    type: 'LIKE',
    isRead: false,
    recipient: { id: 'user1' },
    triggeredBy: { id: 'user2' },
    photo: { id: 'photo1' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockNotificationRepository = {
      findOne: jest.fn().mockResolvedValue(mockNotification),
      save: jest.fn().mockResolvedValue(mockNotification),
      create: jest.fn().mockReturnValue(mockNotification),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases here
});
