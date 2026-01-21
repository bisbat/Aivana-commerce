import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @Public()
  @Get()
  getAllCategories() {
    return this.CategoryService.getAllCategories();
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.CategoryService.createCategory(createCategoryDto);
  }
}
