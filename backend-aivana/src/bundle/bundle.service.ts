import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/product/entities/product.entity";
import { Repository, Brackets } from "typeorm";
import { CreateBundleDto } from './dto/create-bundle.dto';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Injectable()
export class BundleService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) { }

  async bundleRecommend(input: CreateBundleDto) {

    console.log(input)

    // Use LIKE-based category lookup to handle plural/singular mismatches (e.g. 'ui-kits' → 'ui-kit')
    const allCategories = await this.categoryRepository.find();
    const categories = allCategories.filter(c =>
      input.category.some(inputName => {
        const a = inputName.toLowerCase().replace(/s$/, '');
        const b = c.name.toLowerCase().replace(/s$/, '');
        return a === b || c.name.toLowerCase() === inputName.toLowerCase();
      })
    );

    console.log('cate:', categories)

    const categoryIds = categories.map((c) => c.id);
    console.log('id na ja=', categoryIds)

    const goal = `%${input.bundleGoal.toLowerCase()}%`;

    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.tags', 'tag')
      .where(new Brackets(qb => {
        if (categoryIds.length > 0) {
          qb.where('product.categoryId IN (:...categoryIds)', { categoryIds });
        } else {
          qb.where('1=0');
        }
        qb.orWhere('LOWER(product.name) LIKE :goal', { goal })
          .orWhere('LOWER(product.description) LIKE :goal', { goal })
          .orWhere(
            `EXISTS (
          SELECT 1 FROM unnest(product.features) f
          WHERE LOWER(f) LIKE :goal
        )`,
            { goal }
          )
      }))
      .getMany();

    console.log('productsssss', products)

    if (products.length === 0) {
      return {
        goal: input.bundleGoal,
        reason: 'ไม่พบสินค้าที่ตรงกับความต้องการ',
        items: {
          uiKits: [],
          frontendTemplates: [],
          backendTemplates: [],
        }
      }
    }

    const ranked = products
      .map(product => ({ product, score: this.scoreProduct(product, input) }))
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product); // ← แปลงกลับเป็น ProductEntity[]

    const bundle = {
      goal: input.bundleGoal,
      reason: input.reason,
      items: {
        uiKits: ranked.filter(p => p.category?.name === 'ui-kit'),
        frontendTemplates: ranked.filter(p => p.category?.name === 'frontend-template'),
        backendTemplates: ranked.filter(p => p.category?.name === 'backend-template'),
      }
    };

    return bundle
  }

  private scoreProduct(product: ProductEntity, input: CreateBundleDto) {
    let score = 0;

    const featureMatches = product.features?.filter(f =>
      input.tags.some(tag => f.toLowerCase().includes(tag)) ||
      f.toLowerCase().includes(input.bundleGoal.toLowerCase())
    ).length ?? 0;
    score += featureMatches * 4;

    // ✅ นับทุก techstack ที่ match
    const techMatches = product.techstack?.filter(t =>
      input.techstack.includes(t.toLowerCase())
    ).length ?? 0;
    score += techMatches * 3;

    // ✅ นับทุก tag ที่ match
    const tagMatches = product.tags?.filter(tag =>
      input.tags.includes(tag.name.toLowerCase())
    ).length ?? 0;
    score += tagMatches * 2;

    // category match คงไว้เหมือนเดิม
    if (input.category.includes(product.category.name)) {
      score += 1;
    }

    return score;
  }
}
