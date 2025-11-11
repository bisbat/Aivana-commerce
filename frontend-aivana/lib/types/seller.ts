export interface Owner {
    id: string;
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
    promptpay_id: string;
    role: 'customer' | 'seller' | 'admin';
}