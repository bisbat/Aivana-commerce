import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get()
  async getAllTags() {
    return this.tagsService.getAllTags();
  }

  @Public()
  @Get('/navbar')
  async getNavbarTags() {
    return this.tagsService.getNavbarTags();
  }

  @Post()
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }
}
