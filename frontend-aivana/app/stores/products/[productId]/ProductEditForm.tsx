"use client";
import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Product } from '@/lib/types/product';
import { updateProductAction } from '@/lib/actions/product.actions';

// ประเภทของแท็บย่อยภายในฟอร์ม
type SubTab = 'information' | 'images' | 'file';

// --------------------------------------------------------
// Sub-Components สำหรับ Form Tabs
// --------------------------------------------------------

// 1. Tab: ข้อมูลสินค้า (Product Information)
// รับค่า product เพื่อตั้งค่า defaultValue
const ProductInformationForm = ({ product }: { product: Product }) => {
    // โค้ด HTML ของฟอร์มส่วน Product Name, Blurb, Description, Price, Features, Tags
    // ... (ตามโค้ดที่คุณมีในขั้นตอนก่อนหน้า)
    return (
        <div className="space-y-4 pt-4">
            <input type="hidden" name="id" defaultValue={product.id} />
            
            {/* Product Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
                <input type="text" id="name" name="name" defaultValue={product.name} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" required />
            </div>
            {/* tags */}
            {/* can add and delete tags */}
            <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">UI Kit</span>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">Dashboard</span>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">Figma</span>
                </div>
            </div>

            {/* Blurb & Category */}
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="blurb" className="block text-sm font-medium mb-1">Blurb</label>
                    <input type="text" id="blurb" name="blurb" defaultValue={product.blurb} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" />
                </div>
                <div className="w-1/3">
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                    <select id="category" name="category_id" defaultValue={product.category.id} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                        <option value="1">{product.category.name}</option>
                    </select>
                </div>
            </div>
            
            {/* Product Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Product Description</label>
                <textarea id="description" name="description" rows={5} defaultValue={product.description} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" />
            </div>

            {/* Features (max 6) - จำลอง Input 2 ช่องแรก */}
            <div>
                <label className="block text-sm font-medium mb-2">Feature (max 6)</label>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="feature_0" defaultValue={product.features[0] || ''} placeholder="Feature 1" className="p-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    <input type="text" name="feature_1" defaultValue={product.features[1] || ''} placeholder="Feature 2" className="p-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    {/* ... Input features ที่เหลือ (รวม 6 ช่อง) จะถูกเพิ่มใน FormData */}
                </div>
            </div>
            
            {/* Price */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
                <input type="number" id="price" name="price" defaultValue={product.price} step="0.01" className="w-1/3 p-2 bg-gray-700 border border-gray-600 rounded text-white" required />
            </div>
        </div>
    );
};

// 2. Tab: รูปภาพสินค้า (Product Images)
const ProductImagesForm = ({ product }: { product: Product }) => {
    return (
        <div className="space-y-4 pt-4 text-white">
            <h3 className="text-lg font-semibold">จัดการรูปภาพ</h3>
            <p><strong>Hero Image URL ปัจจุบัน:</strong> {product.hero_image_url}</p>
            {/* Input สำหรับการอัปโหลดรูปภาพ */}
            <input type="file" name="hero_image_file" className="block w-full text-sm text-gray-400" />
            <p className="text-xs text-gray-400">อัปโหลดรูปภาพหลัก (สูงสุด 1MB)</p>
            {/* ส่วนสำหรับ Gallery Images */}
        </div>
    );
};

// 3. Tab: ไฟล์สินค้า (Product File)
const ProductFileForm = ({ product }: { product: Product }) => {
    return (
        <div className="space-y-4 pt-4 text-white">
            <h3 className="text-lg font-semibold">จัดการไฟล์</h3>
            <p><strong>ไฟล์ปัจจุบัน:</strong> {product.uploaded_file_path.split('/').pop()}</p>
            {/* Input สำหรับการอัปโหลดไฟล์ */}
            <input type="file" name="product_file" className="block w-full text-sm text-gray-400" />
            <p className="text-xs text-gray-400">อัปโหลดไฟล์สินค้า (เช่น ZIP, PSD, Figma file)</p>
        </div>
    );
};

// Component ย่อยสำหรับปุ่ม Submit
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            aria-disabled={pending}
            className={`px-4 py-2 rounded text-white font-semibold ${pending ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
        >
            {pending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
        </button>
    );
}

// --------------------------------------------------------
// FORM COMPONENT หลัก: ProductEditForm
// --------------------------------------------------------

interface ProductEditFormProps {
    product: Product;
    setIsEditing: (isEditing: boolean) => void;
}

export default function ProductEditForm({ product, setIsEditing }: ProductEditFormProps) {
    // 💡 State สำหรับจัดการ Tabs ภายในฟอร์ม
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('information');

    // ฟังก์ชันสำหรับเรียก Server Action และจัดการผลลัพธ์
    const formAction = async (formData: FormData) => {
        try {
            // เรียก Action และรอให้เสร็จ (updateProductAction อาจคืนค่า void และจะ throw เมื่อเกิดข้อผิดพลาด)
            await updateProductAction(product.id, formData);

            // หากไม่มีข้อผิดพลาด ถือว่าบันทึกสำเร็จ
            alert('บันทึกสำเร็จ! ข้อมูลกำลังถูกอัปเดต');
            setIsEditing(false); // ปิดโหมด Edit
        } catch (error: any) {
            // จัดการข้อผิดพลาดจาก Server Action
            const message = error?.message || 'บันทึกไม่สำเร็จ';
            alert(`เกิดข้อผิดพลาด: ${message}`);
        }
    };

    const getTabClasses = (tabName: SubTab) => {
        const base = "px-4 py-2 text-sm rounded-t-lg font-semibold cursor-pointer transition-colors";
        if (activeSubTab === tabName) {
            return `${base} bg-purple-600 text-white`; // แท็บที่เลือก
        }
        return `${base} bg-gray-700 text-gray-300 hover:bg-gray-600`; // แท็บที่ไม่ได้เลือก
    };

    return (
        // 💡 ฟอร์มหลัก: ผูก action เข้ากับฟังก์ชัน formAction
        // **ทุก Input Field จะถูกรวมใน FormData ไม่ว่าจะอยู่ใน Tab ไหนก็ตาม**
        <form action={formAction} className="space-y-6 text-gray-200">
            
            {/* -------------------- Tabs Navigation -------------------- */}
            <div className="flex space-x-2 border-b-2 border-gray-700">
                <span 
                    className={getTabClasses('information')} 
                    onClick={() => setActiveSubTab('information')}
                >
                    Product Information
                </span>
                <span 
                    className={getTabClasses('images')} 
                    onClick={() => setActiveSubTab('images')}
                >
                    Product Images
                </span>
                <span 
                    className={getTabClasses('file')} 
                    onClick={() => setActiveSubTab('file')}
                >
                    Product File
                </span>
            </div>

            {/* -------------------- Tabs Content -------------------- */}
            <div className="p-4 bg-gray-800 rounded-lg">
                {activeSubTab === 'information' && <ProductInformationForm product={product} />}
                {activeSubTab === 'images' && <ProductImagesForm product={product} />}
                {activeSubTab === 'file' && <ProductFileForm product={product} />}
            </div>

            {/* -------------------- Action Buttons -------------------- */}
            <div className="flex justify-end space-x-3 pt-4">
                <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="px-4 py-2 rounded text-sm bg-gray-600 hover:bg-gray-500 text-white"
                >
                    Cancel
                </button>
                <SubmitButton />
            </div>
        </form>
    );
}