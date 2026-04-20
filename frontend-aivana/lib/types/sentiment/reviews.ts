export interface SentimentReview {
    id: string;
    text: string;
    sentimentLabel: 'pos' | 'neu' | 'neg' | null;
    confidence: number | null;
    analyzedAt: string | null;
    productName: string; 
}