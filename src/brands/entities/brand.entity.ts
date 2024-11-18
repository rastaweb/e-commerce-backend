
import { Exclude } from 'class-transformer';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity("brands")
export class Brand {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id?: number

    @Column({ type: 'tinytext' })
    fa_name: string

    @Column({ type: 'tinytext' })
    en_name: string
    
    @Column({ type: 'text', nullable: true })
    logo: string

    @OneToMany(() => Product, product => product.brand)
    products?: Product[]

    @Exclude()
    @Column({ type: 'int', default: 0 })
    is_deleted?: number
}

