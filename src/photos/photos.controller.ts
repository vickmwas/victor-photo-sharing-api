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
  Query,
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
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

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

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      "Fetch the user's feed, showing photos uploaded by themselves and users they follow",
  })
  @ApiResponse({ status: 200, description: 'User feed' })
  async getUserFeed(
    @Req() req: RequestWithUser,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    const userId = req.user.sub; // Extracted from the token
    const { photos, currentPage, totalPages, totalItems } =
      await this.photosService.getUserFeed(userId, page, limit);
    const perPage = limit;
    return {
      photos,
      currentPage,
      totalPages,
      totalItems,
      perPage,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a photo entry' })
  @ApiResponse({
    status: 201,
    description: 'The photo entry has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createPhotoDto: CreatePhotoDto, @Req() req: RequestWithUser) {
    console.log('Testing Request');
    console.log(req.user);
    const userId = req.user.sub; // Extracted from the token
    return this.photosService.create(createPhotoDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List uploaded photos for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of photos' })
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user.sub; // Extracted from the token
    return this.photosService.findAllByUser(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a photo by ID' })
  @ApiResponse({ status: 200, description: 'Photo details' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  findOne(@Param('id') id: string) {
    return this.photosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a photo by ID' })
  @ApiResponse({ status: 200, description: 'Photo updated successfully' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(id, updatePhotoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a photo by ID' })
  @ApiResponse({ status: 200, description: 'Photo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async likePhoto(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.photosService.likePhoto(id, req.user.sub);
    return { message: 'Photo liked successfully' };
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  async unlikePhoto(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.photosService.unlikePhoto(id, req.user.sub);
    return { message: 'Photo unliked successfully' };
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.photosService.addComment(id, req.user.sub, createCommentDto);
  }

  @Get(':id/details')
  @UseGuards(JwtAuthGuard)
  async getPhotoDetails(@Param('id') id: string) {
    return this.photosService.getPhotoDetails(id);
  }
}
