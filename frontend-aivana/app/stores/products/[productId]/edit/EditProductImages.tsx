'use client';
import { ProductImages } from '@/lib/types/product/product_images';

interface EditProductImagesProps {
  existingImages: ProductImages[];
  newImageFiles: File[];
  onAddImages: (files: File[]) => void;
  onDeleteImage: (imageId: number) => void;
  onRemoveNewImage: (index: number) => void;
}

export default function EditProductImages({
  existingImages,
  newImageFiles,
  onAddImages,
  onDeleteImage,
  onRemoveNewImage
}: EditProductImagesProps) {

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onAddImages(files);
    }
  };

  return (
    <div className="space-y-4">
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">ภาพปัจจุบัน</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((image) => (
              <div key={image.imageId} className="relative group">
                <img
                  src={Array.isArray(image.url) ? image.url[0] ?? '' : (image.url as unknown as string)}
                  alt={`Product detail ${image.imageId}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onDeleteImage(image.imageId)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

        </div>
      )}
      {newImageFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">ภาพใหม่ (ที่จะถูกเพิ่ม)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newImageFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveNewImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add New Images (เพิ่มภาพใหม่)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          คุณสามารถเลือกภาพหลายภาพได้ในครั้งเดียว รูปแบบที่รองรับ: JPG, PNG, GIF
        </p>
      </div>
    </div>
  );
}