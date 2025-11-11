"use client";
import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Product } from '@/lib/types/product';
import { updateProductAction } from '@/lib/actions/product.actions';

// ประเภทของแท็บย่อยภายในฟอร์ม
type SubTab = 'information' | 'images' | 'file';

// Component สำหรับจัดการ Tags
const TagsInput = ({ initialTags, onTagsChange }: { initialTags: string[], onTagsChange: (tags: string[]) => void }) => {
    const [tags, setTags] = useState(initialTags);
    const [inputValue, setInputValue] = useState('');

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        if ((e as React.KeyboardEvent).key === 'Enter' || (e as React.MouseEvent).type === 'click') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                const updatedTags = [...tags, newTag];
                setTags(updatedTags);
                onTagsChange(updatedTags); // อัปเดตไปยัง Parent Component
                setInputValue('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        onTagsChange(updatedTags); // อัปเดตไปยัง Parent Component
    };

    return (
        <div>
            {/* แสดง Tags ที่มีอยู่ */}
            <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                    <span 
                        key={index} 
                        className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm flex items-center cursor-pointer hover:bg-purple-500"
                        onClick={() => handleRemoveTag(tag)}
                    >
                        {tag}
                        <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </span>
                ))}
            </div>
            
            {/* Input สำหรับเพิ่ม Tag ใหม่ */}
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Enter new tag (e.g., React, Figma)"
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <button 
                    type="button" 
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold text-sm"
                >
                    + Add
                </button>
            </div>
            
            {/* Hidden Input Field สำหรับส่งค่า Tags ทั้งหมดในรูปแบบ JSON string หรือ comma-separated ไปยัง Server Action */}
            <input type="hidden" name="tags" value={tags.join(',')} />
        </div>
    );
};

// --------------------------------------------------------
// Sub-Components สำหรับ Form Tabs
// --------------------------------------------------------

// 1. Tab: ข้อมูลสินค้า (Product Information)
// รับค่า product เพื่อตั้งค่า defaultValue
const ProductInformationForm = ({ product }: { product: Product }) => {
    
    // --- State สำหรับจัดการ Tags ---
    // จำลองการดึง Tags จาก Product (ถ้ามี)
    // เนื่องจาก JSON ล่าสุดไม่มี tags field แต่มี category name, เราจะเริ่มต้นด้วย array ว่าง
    const initialTags = ['UI Component', 'Navbar', product.category?.name || ''];

    // State เพื่อเก็บค่า Tags ล่าสุดที่จะส่งไป
    const [currentTags, setCurrentTags] = useState<string[]>(initialTags.filter(t => t));

    // --- State สำหรับ Compatibility ---
    // Compatibility จะถูกส่งเป็น String คั่นด้วย comma
    const compatibilityString = (product.compatibility || []).join(', ');
    

    return (
        <div className="space-y-6 pt-4">
            
            <input type="hidden" name="id" defaultValue={product.id} />
            
            {/* Product Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-200">Product Name</label>
                <input type="text" id="name" name="name" defaultValue={product.name} className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white" required />
            </div>

            {/* Price & Category */}
            <div className="flex space-x-4">
                <div className="w-1/3">
                    <label htmlFor="price" className="block text-sm font-medium mb-1 text-gray-200">Price</label>
                    <input type="number" id="price" name="price" defaultValue={product.price} step="0.01" className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white" required />
                </div>
                <div className="w-2/3">
                    <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-200">Category</label>
                    {/* จำลองการเลือก Category - ในระบบจริง ควรดึงรายการ Category มาแสดง */}
                    <select id="category" name="category_id" defaultValue={product.category.id} className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white">
                        <option value={product.category.id}>{product.category.name}</option>
                        {/* เพิ่มตัวเลือกอื่น ๆ... */}
                        <option value="2">Templates</option>
                        <option value="3">3D Models</option>
                    </select>
                </div>
            </div>
            
            {/* Blurb & Highlight */}
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="blurb" className="block text-sm font-medium mb-1 text-gray-200">Blurb (Short Headline)</label>
                    <input type="text" id="blurb" name="blurb" defaultValue={product.blurb} className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white" />
                </div>
            </div>

            {/* Tags Input Component */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">Product Tags (Click to remove)</label>
                <TagsInput initialTags={currentTags} onTagsChange={setCurrentTags} />
            </div>

            {/* Product Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-200">Product Description</label>
                <textarea id="description" name="description" rows={4} defaultValue={product.description} className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white" />
            </div>

            {/* Features (max 6) */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">Features (max 6)</label>
                <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <input 
                            key={index}
                            type="text" 
                            name={`feature_${index}`} 
                            defaultValue={product.features[index] || ''} 
                            placeholder={`Feature ${index + 1}`} 
                            className="p-3 bg-gray-700 border border-gray-600 rounded text-white" 
                        />
                    ))}
                </div>
            </div>

            {/* Compatibility & Installation Guide */}
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="compatibility" className="block text-sm font-medium mb-1 text-gray-200">Compatibility (Comma Separated)</label>
                    {/* Compatibility จะถูกส่งเป็น String และ Server Action ต้องแปลงกลับเป็น Array */}
                    <input 
                        type="text" 
                        id="compatibility" 
                        name="compatibility" 
                        defaultValue={compatibilityString} 
                        placeholder="e.g., React v18, Tailwind CSS"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white" 
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="installation_guide" className="block text-sm font-medium mb-1 text-gray-200">Installation Guide (Short)</label>
                    <input 
                        type="text" 
                        id="installation_guide" 
                        name="installation_guide" 
                        defaultValue={product.installation_guide} 
                        placeholder="e.g., npm install package"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white" 
                    />
                </div>
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