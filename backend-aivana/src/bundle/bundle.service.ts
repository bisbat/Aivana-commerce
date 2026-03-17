import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/product/entities/product.entity";
import { In, Repository, Brackets } from "typeorm";
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

    const categories = await this.categoryRepository.find({
      where: { name: In(input.category) }
    });

    console.log('cate:', categories)

    const categoryIds = categories.map((c) => c.id);
    console.log('id na ja=', categoryIds)

    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.tags', 'tag')
      .where(new Brackets(qb => {
        qb.where('product.categoryId IN (:...categoryIds)', { categoryIds })
          .orWhere('LOWER(product.name) LIKE :goal', {
            goal: `%${input.bundleGoal.toLowerCase()}%`
          })
          .orWhere('LOWER(product.description) LIKE :goal', {
            goal: `%${input.bundleGoal.toLowerCase()}%`
          })
          .orWhere(
            `EXISTS (
          SELECT 1 FROM unnest(product.features) f
          WHERE LOWER(f) LIKE :goal
        )`,
            { goal: `%${input.bundleGoal.toLowerCase()}%` }
          )
      }))
      .getMany();

    console.log('productsssss', products)

    if (products.length === 0) {
      return {
        goal: input.bundleGoal,
        reason: 'ไม่พบสินค้าที่ตรงกับความต้องการ เลยแนะนำสินค้าพื้นฐานที่คุณอาจสนใจ',
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
        uiKits: ranked.filter(p => p.category.name === 'ui-kits'),
        frontendTemplates: ranked.filter(p => p.category.name === 'frontend-template'),
        backendTemplates: ranked.filter(p => p.category.name === 'backend-template'),
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
