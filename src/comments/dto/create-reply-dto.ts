import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty  } from 'class-validator';

export class CreateReplyDto {
  @ApiProperty({ example: 'This is a reply to the comment' })
  @IsString()
  @IsNotEmpty()
  text: string;
}
