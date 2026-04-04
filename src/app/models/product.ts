import { Review } from './review';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    sellerId: number;
    isActive: boolean;
    image: string[];
    reviews?: Review[];
}