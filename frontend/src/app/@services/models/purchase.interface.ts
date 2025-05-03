import { PixKey } from "/home/analice/Documents/Projects/live_pag/frontend/src/app/@services/api/shared/pix-key.service";
export interface Purchase {
    id: number; 
    purchase_id: number;
    created_at: string;
    is_paid: boolean;
    is_delivery_asked: boolean;
    is_delivery_sent: boolean;
    is_deleted: boolean;
    payment_method: string;
    price: string;
    clothing: string;
    tracking_code?: string;
}

export interface PurchaseWithUI extends Purchase {
    showPaymentOptions?: boolean;
    showDeleteOption?: boolean;
}

export interface ClientPendencies {
    client: string;
    cpf: string;
    total_amount: number;
    purchases: PurchaseWithUI[];
    delivery_requested?: boolean;
    payment_method?: string;
    phone?: string;
    purchase_groups: PurchaseGroup[];
    selectedPixKey?: PixKey;
}

export interface Client {
    client: string;
    cpf: string;
    purchase_id: number;
    created_at: string;
    is_paid: boolean;
    is_delivery_asked: boolean;
    is_delivery_sent: boolean;
    is_deleted: boolean;
    clothing: string;
    price: string;
    payment_method: any;
    purchases: Purchase[];
    phone?: string;
}

export interface PaymentMethod {
    id: number;
    name: string;
}

export interface PurchaseGroup {
    showPixOptions?: boolean;
    selectedPixKey?: PixKey;
    date: string;
    tracking_code?: string;
    purchases: PurchaseWithUI[];
    total_amount: number;
    is_paid: boolean;
    is_delivery_sent: boolean;
    is_deleted: boolean;
    is_delivery_asked: boolean;
    delivery_requested?: boolean;  
    payment_method?: string;
    showPaymentOptions?: boolean; 
    showDeleteOption?: boolean;
    isExpanded?: boolean;
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