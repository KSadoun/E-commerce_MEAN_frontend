export interface Category {
    id: number;
    name: string;
    description: string;
    isRestricted: boolean;
    productsCount?: number;
}
