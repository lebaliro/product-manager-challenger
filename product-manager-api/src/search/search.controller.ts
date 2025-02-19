import { Body, Controller, Get, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './search.dto.ts/search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('vector')
  async vector(@Body() search: SearchDto) {
    return await this.searchService.productVectorSearch(search);
  }
}
