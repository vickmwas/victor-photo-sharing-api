import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { CreatePhotoDto, UploadPhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('photos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Photo upload',
    type: UploadPhotoDto,
  })
  @ApiOperation({ summary: 'Upload a photo' })
  @ApiResponse({
    status: 201,
    description: 'The photo has been successfully uploaded.',
    schema: {
      example: {
        photoUrl: 'https://example.com/photo.jpg',
        filename: 'photo.jpg',
        size: 1024,
        mimeType: 'image/jpeg',
        caption: 'This is a photo caption',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    const url = await this.photosService.uploadFile(file);

    return url;
  }

  @Post()
  create(@Body() createPhotoDto: CreatePhotoDto, @Req() req: RequestWithUser) {
    console.log('Testing Request');
    console.log(req.user);
    const userId = req.user.sub; // Extracted from the token
    return this.photosService.create(createPhotoDto, userId);
  }

  @Get()
  findAll() {
    return this.photosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(+id, updatePhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photosService.remove(+id);
  }
}
