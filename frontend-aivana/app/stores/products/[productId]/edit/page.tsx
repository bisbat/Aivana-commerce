'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductUpdatePayload } from '@/lib/types/product/UpdateProductPayload';
import { ProductImages } from '@/lib/types/product/product_images';
import { ProductForm } from '@/components/products/ProductForm';

export default function EditProductPage() {

  

  return (
    <div>
      <div>
        <button>Back</button>
      </div>
      <h1>Edit page</h1>

    </div>
  );
}
