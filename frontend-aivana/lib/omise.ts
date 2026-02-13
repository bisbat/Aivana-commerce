import { CreditCardData } from "./types/omise";

export const initOmise = (): void => {

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

                if (statusCode !== 200) {
                    reject(response);
                } else {
                    resolve(response);
                }
            }
        );
    });
};