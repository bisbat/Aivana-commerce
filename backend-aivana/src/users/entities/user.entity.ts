import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    first_name: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    last_name: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    promptpay_id: string;

    @Column({ type: 'enum', enum: ['customer', 'seller', 'admin'], default: 'customer' })
    role: string;

    @OneToMany(() => Product, (product) => product.seller)
    products: Product[];

}
