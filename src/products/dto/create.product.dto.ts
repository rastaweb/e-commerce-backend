import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @IsOptional()
    @IsString({ message: 'مقدار متا تایتل باید رشته باشد!' })
    meta_title?: string;

    @IsOptional()
    @IsString({ message: 'مقدار متا دسکریپشن باید رشته باشد!' })
    meta_description?: string;

    @IsNotEmpty({ message: 'مقدار عنوان نباید خالی باشد!' })
    @IsString({ message: 'مقدار عنوان باید از نوع رشته باشد!' })
    title: string

    @IsOptional()
    @IsString({ message: 'مقدار توضیحات باید از نوع رشته باشد!' })
    description?: string

    @IsOptional()
    @IsString({ message: 'مقدار اسلاگ باید از نوع رشته باشد!' })
    slug?: string

    @IsNotEmpty({ message: 'مقدار قیمت نباید خالی باشد!' })
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'مقدار قیمت باید از نوع عدد باشد!' })
    price: number

    @IsOptional()
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'مقدار تخفیف باید از نوع عدد باشد!' })
    discount?: number

    @IsOptional()
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'مقدار موجودی باید از نوع عدد باشد!' })
    quantity?: number

    @IsOptional()
    @IsString({ message: 'مقدار دسته بندی ها باید از نوع رشته باشد!' })
    categories?: string;

    @IsOptional()
    @IsString({ message: 'مقدار برچسب ها باید از نوع رشته باشد!' })
    tagIds?: string;

    @IsOptional()
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'مقدار آیدی برند باید از نوع عدد باشد!' })
    brandId?: number;

}
