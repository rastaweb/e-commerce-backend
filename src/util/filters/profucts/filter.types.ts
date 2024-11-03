export interface ProductFiltersTypes {
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    hasDiscount?: boolean;
    sort?: string;
    tags: string
}

export interface ProductQueryOptions {
    final_price?: any;
    quantity?: any;
    discount?: any;
}