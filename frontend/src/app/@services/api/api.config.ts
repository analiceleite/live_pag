import { environment } from '../../../environments/environment';

export class ApiConfig {
    static readonly BASE_URL = environment.apiUrl;
    
    static readonly PURCHASE = {
        PENDENCIES: `${ApiConfig.BASE_URL}/purchases/pendencies`,
        PENDENCIES_BY_CLIENT: (clientId: number) => `${ApiConfig.BASE_URL}/purchases/pendencies-by-client/${clientId}`,
        CREATE: `${ApiConfig.BASE_URL}/purchases/purchase`,
        MARK_AS_DELETED: (id: number) => `${ApiConfig.BASE_URL}/purchases/mark-as-deleted/${id}`,
        MARK_AS_UNDELETED: (id: number) => `${ApiConfig.BASE_URL}/purchases/mark-as-undeleted/${id}`,
        MARK_AS_PAID: (id: number) => `${ApiConfig.BASE_URL}/purchases/mark-as-paid/${id}`,
        MARK_AS_UNPAID: (id: number) => `${ApiConfig.BASE_URL}/purchases/mark-as-unpaid/${id}`,
        REQUEST_DELIVERY: (id: number) => `${ApiConfig.BASE_URL}/purchases/delivery/request/${id}`,
        MARK_AS_SENT: (id: number) => `${ApiConfig.BASE_URL}/purchases/delivery/send/${id}`,
        MARK_AS_NOT_SENT: (id: number) => `${ApiConfig.BASE_URL}/purchases/delivery/cancel-send/${id}`,
        DELIVERIES_REQUESTED: `${ApiConfig.BASE_URL}/purchases/deliveries-requested`,
        UPDATE_TRACKING: (id: number) => `${ApiConfig.BASE_URL}/purchases/${id}/tracking`,
        GET_PIX_KEY: () => `${ApiConfig.BASE_URL}/purchases/get-pix-key`,
        UPDATE_PIX_KEY: () => `${ApiConfig.BASE_URL}/purchases/set-pix-key`,

    };

    static readonly AUTH = {
        LOGIN: `${ApiConfig.BASE_URL}/auth/login`,
        LOGIN_ADMIN: `${ApiConfig.BASE_URL}/auth/admin-login`,
    };

    static readonly PAYMENT = {
        GET_ALL: `${ApiConfig.BASE_URL}/payments/methods`,
        GET_ACTIVE: `${ApiConfig.BASE_URL}/payments/methods/active`,
        SET_ACTIVE: `${ApiConfig.BASE_URL}/payments/methods/active`,
        MONTHLY_DATA: `${ApiConfig.BASE_URL}/payments/monthly`,
        EXPORT: `${ApiConfig.BASE_URL}/payments/export`
    };

    static readonly PIX = {
        GENERATE: `${ApiConfig.BASE_URL}/pix/generate`
    };

    static readonly MINING = {
        LIST: `${ApiConfig.BASE_URL}/mining/get-all`,
        CREATE: `${ApiConfig.BASE_URL}/mining/create`,
        UPDATE: (id: number) => `${ApiConfig.BASE_URL}/mining/edit/${id}`,
        DELETE: (id: number) => `${ApiConfig.BASE_URL}/mining/delete/${id}`
    };

    static readonly CLOTHING = {
        LIST: `${ApiConfig.BASE_URL}/clothing/get-all`,
        LIST_AVAILABLE: `${ApiConfig.BASE_URL}/clothing/get-available`,
        CREATE: `${ApiConfig.BASE_URL}/clothing/create`,
        UPDATE: (id: number) => `${ApiConfig.BASE_URL}/clothing/edit/${id}`,
        DELETE: (id: number) => `${ApiConfig.BASE_URL}/clothing/delete/${id}`
    };

    static readonly CLIENT = {
        LIST: `${ApiConfig.BASE_URL}/clients/get-all`,
        CREATE: `${ApiConfig.BASE_URL}/clients/create`,
        UPDATE: (id: number) => `${ApiConfig.BASE_URL}/clients/edit/${id}`,
        DELETE: (id: number) => `${ApiConfig.BASE_URL}/clients/delete/${id}`
    };
}