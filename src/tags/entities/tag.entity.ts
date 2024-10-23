import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];
}
