export interface Category {
    id: string;
    name: string;
    description: string;
  }
  
  // Seller type - matches what backend sends
  export interface Seller {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    promptpay_id: string;
    role: string;
    // Note: password should NOT be sent from backend!
  }
  
  // Product type - EXACTLY matching your Postman response
  export interface Product {
    id: string;                    // ← Changed from number to string
    file_path: string;
    title: string;
    description: string;
    installation_doc: string;
    blurb: string;
    preview_url: string;
    price: string;                 // ← Changed from number to string
    features: string[];
    category: Category;            // ← Nested object
    seller: Seller;                // ← Nested object
    created_at: string;
    updated_at: string;
    hero_image: string;
  }

  export interface ProductData {
    productName: string;
    blurb?: string;
    category: string;
    description?: string;
    features: string[];
    installationDoc?: string;
    tags?: string[];
    price: string;
    howToUse?: string;
    livePreview?: string;
  }
