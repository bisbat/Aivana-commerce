import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

@Entity('products')

export class Product {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'text', nullable: true })
    file_path: string;

    @Column({ type: 'text', nullable: false, length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    installation_doc: string;

    @Column({ type: 'text', nullable: true })
    blurb: string;

    @Column({ type: 'text', nullable: true })
    preview_url: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column('text', { array: true, default: '{}' })
    features: string[];

    @ManyToOne(() => Category, (category) => category.products, { nullable: false })
    category: Category;

    @ManyToOne(() => User, (user) => user.products, { nullable: false })
    seller: User;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    updated_at: Date;

    @Column({ type: 'text', nullable: true })
    hero_image: string;

}
