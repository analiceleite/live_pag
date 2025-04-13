export const API_ENDPOINTS = {
    PURCHASE: {
        BASE: '/purchase',
        BY_ID: (id: number) => `/purchase/${id}`,
        MARK_AS_PAID: (id: number) => `/purchase/${id}/mark-as-paid`,
        MARK_AS_UNPAID: (id: number) => `/purchase/${id}/mark-as-unpaid`,
        MARK_AS_SENT: (id: number) => `/purchase/${id}/mark-as-sent`,
        MARK_AS_NOT_SENT: (id: number) => `/purchase/${id}/mark-as-not-sent`,
        DELETE: (id: number) => `/purchase/${id}/delete`,
        RESTORE: (id: number) => `/purchase/${id}/restore`
    },
    CLIENT: {
        BASE: '/client',
        BY_ID: (id: number) => `/client/${id}`
    }
}; 