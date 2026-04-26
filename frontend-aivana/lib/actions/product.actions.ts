"use server";
import { revalidatePath } from "next/cache";
import { ProductInformationFormData } from "../types/formCreateProduct/ProductInformationFormData";
import { UploadFileFormData } from "../types/formCreateProduct/UploadFileFormData";
import { UploadImageFormData } from "../types/formCreateProduct/UploadImageFormData";
import { ProductUpdatePayload } from "../types/product/UpdateProductPayload";
import { UpdatedProductData } from "@/app/stores/products/[productId]/edit/page";
import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function updateProductAction(
  productId: string,
  updatedData: UpdatedProductData,
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
  const formData = new FormData();

  for (const key in updatedData) {
    const value = updatedData[key as keyof UpdatedProductData];

    if (value === undefined || value === null) continue;

    // Handle nested files object
    if (key === "files" && typeof value === "object") {
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
      Authorization: `Bearer ${token}`,
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
export async function deleteProductImageAction(imageId: number) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE_URL}/product-images/${imageId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    revalidatePath(`/stores/products/${imageId}`);
    return await res.json();
  }

  throw new Error("Failed to delete image");
}

export async function deleteProductAction(productId: string, reason?: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
  // ส่งคำขอไปยัง API เพื่อลบสินค้า
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) {
    // Get error message from response
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || "Failed to delete product";
    throw new Error(errorMessage);
  }

  revalidatePath(`/stores/products/${productId}`);
}

export async function getProductHasOrdersAction(
  productId: string,
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  const res = await fetch(`${API_BASE_URL}/products/${productId}/has-orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.hasOrders as boolean;
}

export async function getAllProductsAction() {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(res);

  if (res.ok) {
    const data = await res.json();
    return data;
  }

  throw new Error("Failed to fetch products");
}

export async function getProductByIdAction(productId: string) {
  const token = await getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "GET",
    headers,
  });

  if (res.ok) {
    const text = await res.text();
    // ถ้า response เป็น empty หรือ "null" แสดงว่าสินค้าไม่มี
    if (!text || text === "null") {
      return null;
    }
    return JSON.parse(text);
  }

  throw new Error("Failed to fetch product");
}

export async function createCompleteProduct(
  uploadFileData: UploadFileFormData, // Step 1 data
  productInfoData: ProductInformationFormData, // Step 2 data
  imageData: UploadImageFormData,
) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }
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
      JSON.stringify(productInfoData.compatibility),
    );
    formData.append("techstack", JSON.stringify(productInfoData.techstack));
    formData.append("requirement", JSON.stringify(productInfoData.requirement));
    formData.append("apiDocUrl", productInfoData.apiDocUrl || "");
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

    // ✨ Single API call with everything
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create product: ${errorData}`);
    }

    const createdProduct = await response.json();

    // Revalidate cache
    revalidatePath("/stores");

    return createdProduct;
  } catch (error) {
    throw error;
  }
}

export async function getProductsByTag(tag: string) {
  const res = await fetch(
    `${API_BASE_URL}/products?tag=${encodeURIComponent(tag)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  throw new Error("Failed to fetch products by tag");
}

export async function getProductsByCategory(category: string) {
  const res = await fetch(
    `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  throw new Error("Failed to fetch products by category");
}

export async function getProductsBySearchQuery(query: string) {
  const res = await fetch(
    `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  throw new Error("Failed to fetch products by search query");
}

export async function getProductReviews(productId: number, page: number = 1) {
  const accessToken = await getAccessToken();

  const res = await fetch(
    `${API_BASE_URL}/products/${productId}/reviews?page=${page}&limit=10`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return await res.json();
}
