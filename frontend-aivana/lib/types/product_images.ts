export interface DetailImage {
    image_id: string;
    path_image: string; 
    url: string; 
}

export interface ProductImagesPayload {
    productId: string;
    imageFiles: File[];
}