import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationType } from './entities/notification.entity';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockNotificationRepository: Partial<Repository<Notification>>;

  const mockNotification = {
    id: '1',
    type: NotificationType.LIKE,
    isRead: false,
    recipient: { id: 'user1' },
    triggeredBy: { id: 'user2' },
    photo: { id: 'photo1' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockNotification], 1]),
  };

  beforeEach(async () => {
    mockNotificationRepository = {
      create: jest.fn().mockReturnValue(mockNotification),
      save: jest.fn().mockResolvedValue(mockNotification),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a new notification', async () => {
      const result = await service.createNotification(
        NotificationType.LIKE,
        'user1',
        'user2',
        'photo1',
      );

      expect(result).toEqual(mockNotification);
      expect(mockNotificationRepository.create).toHaveBeenCalled();
      expect(mockNotificationRepository.save).toHaveBeenCalled();
    });
  });

  describe('getUserNotifications', () => {
    it('should return user notifications with pagination', async () => {
      const result = await service.getUserNotifications('user1', 1, 10);

      expect(result.notifications).toHaveLength(1);
      expect(result.meta).toEqual({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
      });
      expect(mockNotificationRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });
  });
});
