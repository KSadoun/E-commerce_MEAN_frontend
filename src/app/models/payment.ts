export interface PaymentMethod {
    code: string;
    label: string;
}

export interface PaymentIntentResponse {
    message: string;
    kashierOrderId: string;
    sessionUrl: string | null;
    sessionData: any;
    order: any;
}

export interface PaymentStatus {
    orderId: number;
    paymentMethod: string;
    paymentStatus: string;
    kashierOrderId: string | null;
    status: string;
}