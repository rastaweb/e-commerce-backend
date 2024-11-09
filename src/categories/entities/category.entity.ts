import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    thumbnail?: string;

    @Column({ type: 'text', nullable: true })
    icon?: string;

    @Column({ type: 'int', default: 0 })
    show_in_home?: number

    @ManyToMany(() => Product, product => product.categories)
    products?: Product[];


    //TODO: gender
}
