import { environment } from '../../../environments/environment';

export class ApiConfig {
    static readonly BASE_URL = environment.apiUrl;
    
    // Purchase endpoints
    static readonly PURCHASE = {
        PENDENCIES: `${ApiConfig.BASE_URL}/pendencies`,
        PENDENCIES_BY_CLIENT: (clientId: number) => `${ApiConfig.BASE_URL}/pendencies-by-client/${clientId}`,
        CREATE: `${ApiConfig.BASE_URL}/purchase`,
        MARK_AS_DELETED: (id: number) => `${ApiConfig.BASE_URL}/mark-as-deleted/${id}`,
        MARK_AS_UNDELETED: (id: number) => `${ApiConfig.BASE_URL}/mark-as-undeleted/${id}`,
        MARK_AS_PAID: (id: number) => `${ApiConfig.BASE_URL}/mark-as-paid/${id}`,
        MARK_AS_UNPAID: (id: number) => `${ApiConfig.BASE_URL}/mark-as-unpaid/${id}`,
        REQUEST_DELIVERY: (id: number) => `${ApiConfig.BASE_URL}/delivery/request/${id}`,
        MARK_AS_SENT: (id: number) => `${ApiConfig.BASE_URL}/delivery/send/${id}`,
        MARK_AS_NOT_SENT: (id: number) => `${ApiConfig.BASE_URL}/delivery/cancel-send/${id}`,
        DELIVERIES_REQUESTED: `${ApiConfig.BASE_URL}/deliveries-requested`
    };

    // Auth endpoints
    static readonly AUTH = {
        LOGIN: `${ApiConfig.BASE_URL}/login`
    };

    // Payment endpoints
    static readonly PAYMENT = {
        GET_ALL: `${ApiConfig.BASE_URL}/methods`,
        GET_ACTIVE: `${ApiConfig.BASE_URL}/methods/active`,
        SET_ACTIVE: `${ApiConfig.BASE_URL}/methods/active`
    };

    // Pix endpoints
    static readonly PIX = {
        GENERATE: `${ApiConfig.BASE_URL}/pix`
    };

    // Mining endpoints
    static readonly MINING = {
        LIST: `${ApiConfig.BASE_URL}/mining`,
        CREATE: `${ApiConfig.BASE_URL}/mining`,
        UPDATE: (id: number) => `${ApiConfig.BASE_URL}/mining/${id}`,
        DELETE: (id: number) => `${ApiConfig.BASE_URL}/mining/${id}`
    };

    // Clothing endpoints
    static readonly CLOTHING = {
        LIST: `${ApiConfig.BASE_URL}/clothing`,
        CREATE: `${ApiConfig.BASE_URL}/clothing`,
        UPDATE: (id: number) => `${ApiConfig.BASE_URL}/clothing/${id}`,
        DELETE: (id: number) => `${ApiConfig.BASE_URL}/clothing/${id}`
    };
} 