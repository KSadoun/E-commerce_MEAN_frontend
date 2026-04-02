import { CartItem } from './cart';
export interface OrderItem {
  productId: number;
  sellerId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  availableStock: number;
  _orderId?: number;
  _itemIndex?: number;
  _userId?: number | null;
  orderStatus?: string;
  paymentStatus?: string;
}

export interface ShippingAddress {
  fullName?: string;         
  street: string;
  city: string;
  state?: string;           
  governorate: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id?: string;
  id: number;
  userId: number | null;
  guestInfo?: any;
  ownerKey?: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  paymentMethod: string;
  currency: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  kashierOrderId?: string | null;
  kashierSessionUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  count: number;
  orders: Order[];
}

export interface CheckoutRequest {
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  guestInfo?: any;
}