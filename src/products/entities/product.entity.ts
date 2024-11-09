
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column({ type: 'varchar', nullable: true })
    meta_title: string

    @Column({ type: 'text', nullable: true })
    meta_description: string

    @Column({ type: 'varchar', unique: true })
    title: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ type: 'varchar', unique: true })
    slug: string

    @Column({ type: 'float' })
    price: number

    @Column({ type: 'float', default: 0 })
    discount: number

    @Column({ type: 'float', nullable: true })
    final_price: number

    // count of product
    @Column({ type: 'int', default: 0 })
    quantity: number

    @Column({ type: 'text', nullable: true })
    thumbnail: number

    @ManyToMany(() => Category, category => category.products)
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => Tag, (tag) => tag.products, { cascade: true })
    @JoinTable()
    tags: Tag[];

    // TODO => keywords
    // TODO => variants
}

