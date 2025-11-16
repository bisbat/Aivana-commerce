'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ProductImage {
  image_id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  blurb: string;
  installation_guide: string;
  features: string[];
  compatibility: string[];
  category: { id: string; name: string };
  hero_image_url: string | null;
  detail_images: ProductImage[];
  uploaded_file_path: string | null;
  preview_url: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [detailPreviews, setDetailPreviews] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`http://localhost:3001/products/${params.productId}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          blurb: data.blurb,
          installation_guide: data.installation_guide,
          features: data.features.join(', '),
          compatibility: data.compatibility.join(', '),
          category: data.category.name,
          preview_url: data.preview_url,
        });
        setHeroPreview(data.hero_image_url);
        setDetailPreviews(data.detail_images.map((img: ProductImage) => img.url));
      }
    }
    fetchProduct();
  }, [params.productId]);

  if (!product) return <p>Loading...</p>;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHeroChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const handleDetailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((f) => URL.createObjectURL(f));
      setDetailPreviews(urls);
    }
  };

  const handleUploadedFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Build form data
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    payload.append('price', formData.price);
    payload.append('blurb', formData.blurb);
    payload.append('installation_guide', formData.installation_guide);
    payload.append('features', formData.features);
    payload.append('compatibility', formData.compatibility);
    payload.append('category', formData.category);
    payload.append('preview_url', formData.preview_url);
    if (uploadedFile) payload.append('uploaded_file', uploadedFile);

    // TODO: handle hero image and detail images uploads if backend supports

    const res = await fetch(`http://localhost:3001/products/${product.id}`, {
      method: 'PUT',
      body: payload,
    });

    if (res.ok) {
      alert('Product updated!');
      router.push(`/products/${product.id}`);
    } else {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-linne-purple p-6 text-white">
      <h1 className="text-3xl font-bold text-primary mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-linne-purple-hover p-6 rounded shadow space-y-4">
          <label className="block">
            <span className="font-semibold">Name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-white border border-gray-300 bg-linne-purple-hover"
            />
          </label>
          <label className="block">
            <span className="font-semibold">Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-white border border-gray-300 bg-linne-purple-hover"
            />
          </label>
          <label className="block">
            <span className="font-semibold">Price</span>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-white border border-gray-300 bg-linne-purple-hover"
            />
          </label>
          <label className="block">
            <span className="font-semibold">Blurb</span>
            <input
              name="blurb"
              value={formData.blurb}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-white border border-gray-300 bg-linne-purple-hover"
            />
          </label>
          <label className="block">
            <span className="font-semibold">Installation Guide</span>
            <textarea
              name="installation_guide"
              value={formData.installation_guide}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-white border border-gray-300 bg-linne-purple-hover"
            />
          </label>
          <label className="block">
            <span className="font-semibold">Features (comma separated)</span>
            <input
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-white border border-gray-300 bg-linne-purple-hover"
            />
          </label>
          <label className="block">
            <span className="font-semibold">Compatibility (comma separated)</span>
            <input
              name="compatibility"
              value={formData.compatibility}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-white border border-gray-300 bg-linne-purple-hover"
            />
          </label>
          <label className="block">
            <span className="font-semibold">Category</span>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-white border border-gray-300 bg-linne-purple-hover"
            />
          </label>
          <label className="block">
            <span className="font-semibold">Preview URL</span>
            <input
              name="preview_url"
              value={formData.preview_url}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-white border border-gray-300 bg-linne-purple-hover"
            />
          </label>
        </div>

        {/* Images */}
        <div className="bg-linne-purple-hover p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold text-primary">Hero Image</h2>
          {heroPreview && <img src={heroPreview} className="w-full max-h-[400px] object-contain rounded mb-2" />}
          <input type="file" accept="image/*" onChange={handleHeroChange} />

          <h2 className="text-xl font-semibold text-primary mt-4">Detail Images (max 8)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {detailPreviews.slice(0, 8).map((url, i) => (
              <img key={i} src={url} className="w-full h-32 object-cover rounded" />
            ))}
          </div>
          <input type="file" accept="image/*" multiple onChange={handleDetailChange} />
        </div>

        {/* Uploaded File */}
        <div className="bg-linne-purple-hover p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-primary">Uploaded File</h2>
          {product.uploaded_file_path && <p>{product.uploaded_file_path}</p>}
          <input type="file" onChange={handleUploadedFileChange} />
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover px-6 py-3 rounded text-white border border-gray-300 bg-linne-purple-hover font-semibold shadow"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
