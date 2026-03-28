export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    address: string;
    paymentDetails: any[];
    wishlist: any[];
    isActive: boolean;
    isDeleted: boolean;
    __v: number;
    createdAt: string;
    updatedAt: string;
}