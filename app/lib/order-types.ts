export enum PaymentStatus {
    Pending = 'pending',
    Paid = 'paid',
    Failed = 'failed',
    Refunded = 'refunded'
}

export enum OrderStatus {
    Created = 'created',
    Confirmed = 'confirmed',
    Fulfilled = 'fulfilled',
    Cancelled = 'cancelled'
}

export enum FulfillmentType {
    Delivery = 'delivery',
    Installation = 'installation'
}

export enum FulfillmentStatus {
    Pending = 'pending',
    Scheduled = 'scheduled',
    InProgress = 'in_progress',
    Completed = 'completed',
    Cancelled = 'cancelled'
}
