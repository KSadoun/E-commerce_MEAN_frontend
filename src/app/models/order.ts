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
  _userId?: number;
  orderStatus?: string;
  paymentStatus?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  id: number;
  userId: number;
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
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}
