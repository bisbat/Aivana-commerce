export const initOmise = (): void => {
    if (typeof window === 'undefined') {
        console.warn('Omise can only be initialized in browser');
        return;
    }

    if (!(window as any).Omise) {
        console.error('Omise.js not loaded. Make sure to include the script in your HTML.');
        return;
    }

    const publicKey = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY;

    if (!publicKey) {
        console.error('NEXT_PUBLIC_OMISE_PUBLIC_KEY is not defined');
        return;
    }

    (window as any).Omise.setPublicKey(publicKey);
};


export const createPromptpaySource = (amount: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        (window as any).Omise.createSource(
            'promptpay',
            {
                amount: amount * 100,
                currency: 'THB',
                type: 'promptpay',
            },
            (statusCode: number, response: any) => {
                if (statusCode !== 200) {
                    reject(response);
                } else {
                    resolve(response);
                }
            }
        );
    });
};