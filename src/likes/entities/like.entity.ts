import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Photo } from '../../photos/entities/photo.entity';
import { User } from '../../users/entities/user.entity';

@Entity('likes')
export class Like {
  @PrimaryColumn()
  photoId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Photo, (photo) => photo.likes)
  photo: Photo;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
