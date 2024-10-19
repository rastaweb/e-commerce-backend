
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({ type: 'boolean' })
    availability: number

    @Column({ type: 'text' })
    thumbnail: number

    // TODO => keywords
    // TODO => tags
}

