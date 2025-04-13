export interface Purchase {
    purchase_id: number;
    created_at: string;
    is_paid: boolean;
    is_delivery_asked: boolean;
    is_delivery_sent: boolean;
    is_deleted: boolean;
    payment_method: string;
    price: string;
    clothing: string;
}

export interface Client {
    client: string;
    cpf: string;
    purchase_id: number;
    created_at: string;
    is_paid: boolean;
    is_delivery_asked: boolean;
    is_delivery_sent: boolean;
    clothing: string;
    price: string;
    payment_method: any;
    purchases: Purchase[]; 
    is_deleted?: boolean; 
}

export interface PaymentMethod {
    id: number;
    name: string;
}

export interface PurchaseGroup {
    [key: string]: Purchase[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

export interface PurchaseStatus {
    is_paid: boolean;
    is_delivery_sent: boolean;
    is_deleted: boolean;
}

export type PurchaseTab = 'open' | 'sent' | 'completed' | 'deleted'; 