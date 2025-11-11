"use client";
import React, { useState } from 'react';
// import { useFormStatus } from 'react-dom'; // ไม่ได้ใช้ใน View Mode
import { Product } from '@/lib/types/product';
// import { updateProductAction } from '@/lib/actions/product.actions'; // ไม่ได้ใช้ใน View Mode

// ประเภทของแท็บย่อยภายในฟอร์ม
type SubTab = 'information' | 'images' | 'file';

// --------------------------------------------------------
// Sub-Components สำหรับ View Tabs (เปลี่ยนจาก Form เป็น View)
// --------------------------------------------------------

// 1. Tab: ข้อมูลสินค้า (Product Information View)
const ProductInformationView = ({ product }: { product: Product }) => {
    return (
        <div className="space-y-4 pt-4">
            {/* <div><input type="hidden" name="id" defaultValue={product.id} /></div> // ไม่ได้ใช้ */}
            
            {/* Product Name */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Product Name</label>
                <p className="w-full p-2 rounded text-white font-semibold">{product.name}</p>
            </div>
            
            {/* Blurb & Category */}
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-gray-400">Blurb</label>
                    <p className="w-full p-2 border border-gray-600 rounded text-white italic">{product.blurb || '— ไม่มี Blurb —'}</p>
                </div>
                <div className="w-1/3">
                    <label className="block text-sm font-medium mb-1 text-gray-400">Category</label>
                    {/* แสดงชื่อ Category แทนการใช้ Select */}
                    <p className="w-full p-2 border border-gray-600 rounded text-white">{product.category.name}</p>
                </div>
            </div>
            
            {/* Product Description */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Product Description</label>
                <div className="w-full p-2 border border-gray-600 rounded text-white whitespace-pre-wrap min-h-[100px]">
                    {product.description}
                </div>
            </div>

            {/* Features (max 6) */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Features</label>
                <div className="grid grid-cols-2 gap-4">
                    {/* วนลูปแสดง Feature ทั้งหมด */}
                    {product.features.map((feature, index) => (
                        <p key={index} className="p-2 border border-gray-600 rounded text-white">
                            {index + 1}. {feature}
                        </p>
                    ))}
                    {/* หากมี feature ไม่ถึง 6 ให้แสดงช่องว่างแทน */}
                    {Array.from({ length: 6 - product.features.length }).map((_, index) => (
                         <p key={`empty-${index}`} className="p-2 border border-gray-600 rounded text-gray-500 italic">
                            — ว่าง —
                        </p>
                    ))}
                </div>
            </div>
            
            {/* Price */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Price</label>
                <p className="w-1/3 p-2 border border-gray-600 rounded text-white text-lg font-bold">
                    ${product.price}
                </p>
            </div>
        </div>
    );
};

// 2. Tab: รูปภาพสินค้า (Product Images View)
const ProductImagesView = ({ product }: { product: Product }) => {
    return (
        <div className="space-y-4 pt-4 text-white">
            <h3 className="text-lg font-semibold">Hero Image</h3>
            <p><strong>Hero Image URL:</strong> {product.hero_image_url}</p>
            {/* แสดงรูปภาพแทน Input อัปโหลด */}
            <div className="w-full h-48 bg-gray-700 border border-gray-600 rounded flex items-center justify-center overflow-hidden">
                {product.hero_image_url ? (
                    // ใช้ Image tag จริงในโค้ด React แต่ในที่นี้ใช้ div จำลอง
                    <div className="text-gray-400">
                        [Image Preview: {product.hero_image_url.split('/').pop()}]
                        {/* <img src={product.hero_image_url} alt="Hero Image" className="object-cover w-full h-full" /> */}
                    </div>
                ) : (
                    <span className="text-gray-500">No Hero Image Available</span>
                )}
            </div>
            
            <h3 className="text-lg font-semibold pt-4">Gallery Images</h3>
            <p className="text-sm text-gray-400">This section would show gallery images if available.</p>
        </div>
    );
};

// 3. Tab: ไฟล์สินค้า (Product File View)
const ProductFileView = ({ product }: { product: Product }) => {
    const fileName = product.uploaded_file_path.split('/').pop();
    
    return (
        <div className="space-y-4 pt-4 text-white">
            <h3 className="text-lg font-semibold">Product File</h3>
            <p><strong>ไฟล์ปัจจุบัน:</strong> {fileName}</p>
            
            {/* แสดงปุ่ม Download หรือสถานะแทน Input อัปโหลด */}
            {product.uploaded_file_path ? (
                <a 
                    href={product.uploaded_file_path} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block px-4 py-2 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                    Download File
                </a>
            ) : (
                <p className="text-sm text-gray-400 italic">No product file uploaded.</p>
            )}
        </div>
    );
};


// --------------------------------------------------------
// VIEW COMPONENT หลัก: ProductViewForm
// --------------------------------------------------------

interface ProductViewFormProps {
    product: Product;
    // setIsEditing: (isEditing: boolean) => void; // ไม่ได้ใช้
    onClose: () => void; // เพิ่ม Prop สำหรับปุ่ม Close/Back
}

export default function ProductViewForm({ product, onClose }: ProductViewFormProps) {
    // 💡 State สำหรับจัดการ Tabs ภายในฟอร์ม
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('information');

    const getTabClasses = (tabName: SubTab) => {
        const base = "px-4 py-2 text-sm rounded-t-lg font-semibold cursor-pointer transition-colors";
        if (activeSubTab === tabName) {
            return `${base} bg-purple-600 text-white`; // แท็บที่เลือก
        }
        // ใน View Mode แท็บที่ไม่ได้เลือกยังคงมีสีคล้ายเดิม แต่ไม่มี hover effect ที่สื่อถึงการเลือกมากนัก
        return `${base} bg-gray-700 text-gray-300 hover:bg-gray-600`; 
    };

    return (
        <div className="space-y-6 text-gray-200">
            
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
                {activeSubTab === 'information' && <ProductInformationView product={product} />}
                {activeSubTab === 'images' && <ProductImagesView product={product} />}
                {activeSubTab === 'file' && <ProductFileView product={product} />}
            </div>

            {/* -------------------- Action Buttons (View Mode) -------------------- */}
            <div className="flex justify-end pt-4">
                <button 
                    type="button" 
                    onClick={onClose} // ใช้ onClose แทน setIsEditing(false)
                    className="px-4 py-2 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                    Close / Back
                </button>
            </div>
        </div>
    );
}