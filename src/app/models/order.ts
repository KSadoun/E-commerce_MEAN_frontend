import { CartItem } from './cart';

export interface Order {
    id: number;
    userId: number | null;
    guestInfo: any;
    ownerKey: string;
    status: string;
    shippingStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    kashierOrderId: string | null;
    kashierSessionUrl: string | null;
    shippingAddress: any;
    currency: string;
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderListResponse {
    count: number;
    orders: Order[];
}

export interface CheckoutRequest {
    paymentMethod: string;
    shippingAddress: {
        street: string;
        city: string;
        governorate: string;
        postalCode: string;
        country: string;
    };
    guestInfo?: any;
}