import { CreditCardData } from "./types/omise";

export const initOmise = (): void => {
    // if (typeof window === 'undefined') {
    //     console.warn('Omise can only be initialized in browser');
    //     return;
    // }

    // if (!(window as any).Omise) {
    //     console.error('Omise.js not loaded. Make sure to include the script in your HTML.');
    //     return;
    // }

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

export const createCreditCardToken = (cardData: CreditCardData): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Omise is only available in browser'));
            return;
        }

        if (!(window as any).Omise) {
            reject(new Error('Omise.js not loaded. Did you call initOmise()?'));
            return;
        }

        console.log('🏦 Creating credit card token...');

        console.log('data:', cardData);

        (window as any).Omise.createToken(
            'card',
            {
                name: cardData.name,
                number: cardData.number,
                expiration_month: cardData.expiryMonth,
                expiration_year: cardData.expiryYear,
                security_code: cardData.cvc,
            },
            (statusCode: number, response: any) => {
                console.log('📥 Omise response:', { statusCode, response });

                if (statusCode !== 200) {
                    console.error('❌ Omise error:', response);
                    reject(response);
                } else {
                    console.log('✅ Token created successfully:', response.id);
                    resolve(response);
                }
            }
        );
    });
};