import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: Partial<Repository<User>>;
  let mockNotificationsService: Partial<NotificationsService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    following: [],
    followers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn().mockReturnValue(mockUser),
      save: jest.fn().mockResolvedValue(mockUser),
      findOne: jest.fn().mockResolvedValue(mockUser),
    };

    mockNotificationsService = {
      createNotification: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });
});
