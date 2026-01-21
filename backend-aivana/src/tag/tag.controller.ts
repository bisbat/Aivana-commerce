import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('tags')
export class TagController {
  constructor(private readonly TagService: TagService) {}

  @Public()
  @Get()
  async getAllTags() {
    return this.TagService.getAllTags();
  }

  @Public()
  @Get('/navbar')
  async getNavbarTags() {
    return this.TagService.getNavbarTags();
  }

  @Post()
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.TagService.createTag(createTagDto);
  }
}
