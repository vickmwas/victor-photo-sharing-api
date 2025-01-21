import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  RelationCount,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Hashtag } from 'src/hashtags/entities/hashtag.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @Column()
  photoUrl: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  caption: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.photo)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.photo)
  likes: Like[];

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.photos)
  @JoinTable()
  hashtags: Hashtag[];

  likeCount?: number;
  commentCount?: number;
}
