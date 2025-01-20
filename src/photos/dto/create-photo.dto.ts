import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UploadPhotoDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The photo file',
  })
  file: any;
}
export class CreatePhotoDto {
  @ApiProperty({
    example: 'https://s3-url/photo.jpg',
    description: 'The photo URL',
  })
  @IsString()
  photoUrl: string;

  @ApiProperty({
    example: 'photo.jpg',
    description: 'The photo filename',
  })
  @IsString()
  filename: string;

  @ApiProperty({
    example: 1024,
    description: 'The photo size in bytes',
  })
  @IsNumber()
  size: number;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'The photo MIME type',
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    example: 'This is a photo caption',
    description: 'The photo caption',
  })
  @IsString()
  caption: string;
}
