export interface CartItem {
    productId: number;
    sellerId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    availableStock: number;
}

export interface CartResponse {
    ownerKey: string;
    count: number;
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    currency: string;
    items: CartItem[];
}

export interface CartSummary {
    ownerKey: string;
    itemCount: number;
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    currency: string;
}