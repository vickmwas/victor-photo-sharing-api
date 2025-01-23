import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchParamsDto } from './dto/search-params.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search by hashtag or username' })
  @ApiResponse({
    status: 200,
    description: 'Returns photos matching hashtag or username',
  })
  async search(@Query() searchParams: SearchParamsDto) {
    return this.searchService.search(searchParams);
  }
}
