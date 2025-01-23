import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { NotificationType } from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private notificationsService: NotificationsService,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // Encrypt the password and save the user details
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['photos', 'followers', 'following'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const followerCount = user.followers.length;
    const followingCount = user.following.length;

    return {
      ...user,
      followerCount,
      followingCount,
    };

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [
        { username }, // Check username
        { email: username }, // Check email (since login accepts either)
      ],
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async followUser(userId: string, targetUserId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
      relations: ['followers'],
    });

    if (!user || !targetUser) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'following')
      .of(userId)
      .add(targetUserId);

    // Create notification for followed user
    await this.notificationsService.createNotification(
      NotificationType.FOLLOW,
      targetUserId,
      userId,
    );

    // user.following.push(targetUser);
    // targetUser.followers.push(user);

    // await this.userRepository.save(user);
    // await this.userRepository.save(targetUser);
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
      relations: ['followers'],
    });

    if (!user || !targetUser) {
      throw new NotFoundException('User not found');
    }

    user.following = user.following.filter((u) => u.id !== targetUserId);
    targetUser.followers = targetUser.followers.filter((u) => u.id !== userId);

    await this.userRepository.save(user);
    await this.userRepository.save(targetUser);
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id: userId,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.userRepository.save(user);
  }
}
