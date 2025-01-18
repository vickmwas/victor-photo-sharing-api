import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('followers')
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  followerId: number;

  @Column({ type: 'enum', enum: ['approved', 'pending'], default: 'approved' })
  status: 'approved' | 'pending';

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
