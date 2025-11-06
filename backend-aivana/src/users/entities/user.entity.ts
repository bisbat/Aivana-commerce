import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRoles } from 'src/utility/common/user-roles.enum';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity('users')
export class UserEntity {
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

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.CUSTOMER })
  role: UserRoles;

  @OneToMany(() => ProductEntity, (product) => product.owner)
  owned_products: ProductEntity[];
}
