import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "src/products/entities/product.entity";

@Entity('tag')
export class TagEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    // Many-to-Many relationship with ProductEntity
    @ManyToMany(() => ProductEntity, (product) => product.tags)
    products: ProductEntity[];
}
