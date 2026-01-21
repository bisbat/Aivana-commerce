import { ReportStatus } from "src/constants/report-status.enum";
import { OrderItemEntity } from "src/order-item/entities/order-item.entity";
import { UserEntity } from "src/users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  JoinColumn,

} from "typeorm";

@Entity("reports")
export class ReportEntity {
    @PrimaryGeneratedColumn()
    id: number;

    status: ReportStatus;

    @OneToOne(() => UserEntity, user => user.reports, {
        nullable: false,
    })
    @JoinColumn({ name: "reportedById" })
    reportedBy: UserEntity;
    
    @OneToOne(() => OrderItemEntity, {
        nullable: false,
    })
    @JoinColumn({ name: "orderItemId" })
    orderItem: OrderItemEntity;    

    reason: string;

    @CreateDateColumn()
    createdAt: Date;
}
