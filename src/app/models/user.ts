export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | string;
  last4?: string;
  cardHolder?: string;
  expiryMonth?: string;
  expiryYear?: string;
  brand?: string;
  email?: string; // for paypal
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    address: string;
    paymentDetails: PaymentMethod[];
    isActive: boolean;
    isDeleted: boolean;
}