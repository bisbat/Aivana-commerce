import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserRoles } from 'src/constants/user-roles.enum';
import { SellerEntity } from 'src/sellers/entities/seller.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.CUSTOMER })
  role: UserRoles;

  @OneToOne(() => SellerEntity, (seller) => seller.user, { nullable: true })
  @JoinColumn({ name: 'sellerId' })
  sellerProfile: SellerEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
