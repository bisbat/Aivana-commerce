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

    const allCategories = await this.categoryRepository.find();
    const categories = allCategories.filter(c =>
      input.category.some(inputName => {
        const a = inputName.toLowerCase().replace(/s$/, '');
        const b = c.name.toLowerCase().replace(/s$/, '');
        return a === b || c.name.toLowerCase() === inputName.toLowerCase();
      })
    );

    const categoryIds = categories.map((c) => c.id);
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

    if (products.length === 0) {
      return {
        goal: input.bundleGoal,
        reason: 'ไม่พบสินค้าที่ตรงกับความต้องการ',
        items: { uiKits: [], frontendTemplates: [], backendTemplates: [] }
      }
    }

    // ── debug: ดู score แต่ละตัว ──────────────────────────────
    const scored = products.map(product => ({
      product,
      score: this.scoreProduct(product, input)
    }));

    console.table(scored.map(r => ({
      name: r.product.name,
      score: r.score,
      category: r.product.category?.name
    })));
    // ─────────────────────────────────────────────────────────

    const TOP_N = 3;

    const ranked = scored
      .filter(({ score }) => score > 0)   // ✅ ตัด score 0 ออก
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);

    const bundle = {
      goal: input.bundleGoal,
      reason: input.reason,
      items: {
        uiKits: ranked.filter(p => p.category?.name === 'ui-kit').slice(0, TOP_N),
        frontendTemplates: ranked.filter(p => p.category?.name === 'frontend-template').slice(0, TOP_N),
        backendTemplates: ranked.filter(p => p.category?.name === 'backend-template').slice(0, TOP_N),
      }
    };

    return bundle;
  }

  private scoreProduct(product: ProductEntity, input: CreateBundleDto) {
    let score = 0;

    // feature match — สำคัญสุด
    const featureMatches = product.features?.filter(f =>
      input.tags.some(tag => f.toLowerCase().includes(tag)) ||
      f.toLowerCase().includes(input.bundleGoal.toLowerCase())
    ).length ?? 0;
    score += featureMatches * 4;

    // techstack match — normalize เป็น %
    const totalTech = input.techstack.length || 1;
    const techMatches = product.techstack?.filter(t =>
      input.techstack.includes(t.toLowerCase())
    ).length ?? 0;
    score += (techMatches / totalTech) * 10;

    // tag match
    const tagMatches = product.tags?.filter(tag =>
      input.tags.includes(tag.name.toLowerCase())
    ).length ?? 0;
    score += tagMatches * 2;

    // name match — exact vs partial
    const goalLower = input.bundleGoal.toLowerCase();
    const goalWords = goalLower.split(' ');

    if (product.name.toLowerCase().includes(goalLower)) {
      score += 5;   // exact match
    } else {
      const wordMatches = goalWords.filter(w =>
        product.name.toLowerCase().includes(w)
      ).length;
      score += wordMatches * 1;   // partial match
    }

    // description match
    if (product.description?.toLowerCase().includes(goalLower)) {
      score += 1;
    }

    // category match
    if (input.category.includes(product.category?.name)) {
      score += 1;
    }

    return score;
  }
}
