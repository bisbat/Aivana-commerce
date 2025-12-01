"use server";
import { revalidatePath } from "next/cache";
import { ProductInformationFormData } from "../types/formCreateProduct/ProductInformationFormData";
import { UploadFileFormData } from "../types/formCreateProduct/UploadFileFormData";
import { UploadImageFormData } from "../types/formCreateProduct/UploadImageFormData";
import { ProductUpdatePayload } from "../types/product/UpdateProductPayload";
import { UpdatedProductData } from "@/app/stores/products/[productId]/edit/page";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function updateProductAction(
  productId: string,
  updatedData: UpdatedProductData,
  accessToken?: string
) {
  console.log(updatedData);

  const formData = new FormData();

  for (const key in updatedData) {
    const value = updatedData[key as keyof UpdatedProductData];

    if (value === undefined || value === null) continue;

    // Handle nested files object
    if (key === 'files' && typeof value === 'object') {
      for (const fileKey in value) {
        const fileOrFiles = value[fileKey as keyof typeof value];

        if (!fileOrFiles) continue;

        // Single file
        if (fileOrFiles instanceof File) {
          formData.append(fileKey, fileOrFiles);
        }
        // Array of files (e.g., detailImages)
        else if (Array.isArray(fileOrFiles)) {
          fileOrFiles.forEach((f) => formData.append(fileKey, f));
        }
      }
    }

    // Handle arrays by stringifying them
    else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    }
    // Handle primitive values
    else {
      formData.append(key, String(value));
    }
  }

  console.log(formData);


  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  // Revalidate cache
  revalidatePath(`/stores/products/${productId}`);

  return await res.json();
}




// ฟังก์ชันสำหรับลบ detail image
export async function deleteProductImageAction(
  imageId: number,
  accessToken?: string
) {
  const res = await fetch(`${API_BASE_URL}/product-images/${imageId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.ok) {
    revalidatePath(`/stores/products/${imageId}`);
    return await res.json();
  }

  throw new Error("Failed to delete image");
}

export async function deleteProductAction(
  productId: string,
  accessToken?: string
) {
  // ส่งคำขอไปยัง API เพื่อลบสินค้า
  const res = await fetch(`http://localhost:3001/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.ok) {
    // 2. ✅ อัปเดตข้อมูลใน Cache
    revalidatePath(`/stores/products/${productId}`);
  }
}

export async function getAllProductsAction() {
  const res = await fetch(`http://localhost:3001/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const data = await res.json();
    return data;
  }

  throw new Error("Failed to fetch products");
}

export async function getProductByIdAction(productId: string) {
  const res = await fetch(`http://localhost:3001/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const data = await res.json();
    return data;
  }

  throw new Error("Failed to fetch product");
}
export async function createCompleteProduct(
  uploadFileData: UploadFileFormData, // Step 1 data
  productInfoData: ProductInformationFormData, // Step 2 data
  imageData: UploadImageFormData,
  accessToken?: string | undefined // Step 3 data
) {
  try {
    // Create FormData with ALL information
    const formData = new FormData();

    // Step 2: Product Information (metadata)
    formData.append("name", productInfoData.name);
    formData.append("description", productInfoData.description);
    formData.append("price", productInfoData.price.toString());
    formData.append("blurb", productInfoData.blurb);
    formData.append("installationGuide", productInfoData.installationGuide);
    formData.append("previewUrl", productInfoData.previewUrl || "");
    formData.append("categoryId", productInfoData.categoryId.toString());
    formData.append("sellerId", productInfoData.sellerId.toString());

    // Arrays as JSON strings
    formData.append("features", JSON.stringify(productInfoData.features));
    formData.append(
      "compatibility",
      JSON.stringify(productInfoData.compatibility)
    );
    formData.append("tagIds", JSON.stringify(productInfoData.tagIds));

    // Step 1: Product File (.zip, .fig, etc.)
    if (uploadFileData.file) {
      formData.append("productFile", uploadFileData.file);
    }

    // Step 3: Hero Image
    if (imageData.heroImage) {
      formData.append("heroImage", imageData.heroImage);
    }

    // Step 3: Detail Images (multiple files)
    if (imageData.detailImages.length > 0) {
      imageData.detailImages.forEach((image) => {
        formData.append("detailImages", image);
      });
    }

    console.log("📤 Sending complete product to backend...");

    // ✨ Single API call with everything
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create product: ${errorData}`);
    }

    const createdProduct = await response.json();
    console.log("✅ Product created successfully:", createdProduct);

    // Revalidate cache
    revalidatePath("/stores");

    return createdProduct;
  } catch (error) {
    console.error("❌ Error creating complete product:", error);
    throw error;
  }
}
