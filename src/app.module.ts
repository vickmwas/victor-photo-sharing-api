import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from 'typeorm/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PhotosModule } from './photos/photos.module';
import { FollowersModule } from './followers/followers.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PhotosModule,
    FollowersModule,
    LikesModule,
    CommentsModule,
    HashtagsModule, // Load TypeORM configuration
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
