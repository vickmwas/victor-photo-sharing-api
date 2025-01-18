import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Photo } from '../../photos/entities/photo.entity';
import { Hashtag } from './hashtag.entity';

@Entity('photo_hashtags')
export class PhotoHashtag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Photo, (photo) => photo.id)
  photoId: number;

  @ManyToOne(() => Hashtag, (hashtag) => hashtag.id)
  hashtagId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
