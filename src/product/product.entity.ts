import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Brand } from '../brand/brand.entity';
import { Status } from './enums/status.enum';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'double precision', name: 'selling_price' })
  sellingPrice: number;

  @Column({ type: 'double precision', name: 'purchase_price' })
  purchasePrice: number;

  @Column({ name: 'stock_quantity' })
  stockQuantity: number;

  @Column({ type: 'varchar', length: 10, name: 'costing_method' })
  costingMethod: string;

  @Column({ type: 'varchar', length: 20, name: 'barcode' })
  barcode: string;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
