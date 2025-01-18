import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseUserDto {
  @ApiProperty({
    example: 'Victor Mwangi',
    description: 'The name of the user',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 'johndoe', description: 'The username of the user' })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The user password' })
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Hi, I am John',
    description: 'The user bio',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'The profile photo URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;
}
