import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Photo } from '../photos/entities/photo.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const [notifications, total] =
      await this.notificationsRepository.findAndCount({
        where: { recipient: { id: userId } },
        relations: ['triggeredBy', 'photo', 'comment'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      notifications,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createNotification(
    type: NotificationType,
    recipientId: string,
    triggeredById: string,
    photoId?: string,
    commentId?: string,
  ) {
    const notification = this.notificationsRepository.create({
      type,
      recipient: { id: recipientId },
      triggeredBy: { id: triggeredById },
      photo: photoId ? { id: photoId } : null,
      comment: commentId ? { id: commentId } : null,
    });

    return this.notificationsRepository.save(notification);
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationsRepository.update(
      { id: notificationId, recipient: { id: userId } },
      { isRead: true },
    );
  }
}
