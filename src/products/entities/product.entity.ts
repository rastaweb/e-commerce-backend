
import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column({ type: 'varchar', length: 255 })
    meta_title: string

    @Column({ type: 'text' })
    meta_description: string

    @Column({ type: 'varchar', length: 255, unique: true })
    title: string

    @Column({ type: 'text' })
    description: string

    @Column({ type: 'varchar', length: 255 })
    slug: string

    @Column({ type: 'float' })
    price: number

    @Column({ type: 'int' })
    discount: number

    @Column({ type: 'float' })
    final_price: number

    // count of product
    @Column({ type: 'int' })
    quantity: number

    @Column({ type: 'int', default: 0 })
    availability: number

    @Column({ type: 'text' })
    thumbnail: number


    @ManyToMany(() => Category, category => category.products)
    @JoinTable()
    categories: Category[];

    // TODO => keywords
    // TODO => tags
}

