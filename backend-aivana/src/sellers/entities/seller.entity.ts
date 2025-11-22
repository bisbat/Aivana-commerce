import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "src/users/entities/user.entity";
import { ProductEntity } from "src/products/entities/product.entity";

@Entity('sellers')
export class SellerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UserEntity, (user) => user.sellerProfile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ nullable: true })
    location: string;

    @Column('simple-array', { nullable: true })
    skills: string[];

    @Column('simple-array', { nullable: true })
    tools: string[];

    @Column('json', { nullable: true })
    socialLinks: Record<string, string>;

    @Column({ nullable: false })
    bankName: string;

    @Column({ nullable: false })
    bankAccountNumber: string;

    @Column({ nullable: false })
    bankAccountName: string; 

    @OneToMany(() => ProductEntity, (product) => product.seller)
    products: ProductEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
