import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Repository } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let mockUserRepository: Partial<Repository<User>>;
  let mockNotificationsService: Partial<NotificationsService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword123',
  };

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn().mockResolvedValue(mockUser),
      save: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn().mockReturnValue(mockUser),
    };

    mockNotificationsService = {
      createNotification: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases here
});
