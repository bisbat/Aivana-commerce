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

    // จำลองข้อมูล Tags, Compatibility และ Highlight
    // ใน Product จริง อาจต้องมีการดึงค่าเหล่านี้จาก product object
    const productTags = ['UI Kit', 'Dashboard', 'Figma', 'Web'];
    const compatibility = ['Figma', 'Sketch', 'Adobe XD'];
    const highlight = "This product is a bestseller with full component library access.";

    // ฟังก์ชันสำหรับแสดงค่าในรูปแบบ View (ลบ border และใช้ bg-gray-700/800)
    const ValueDisplay = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
        <div className={`w-full p-2 bg-gray-800 rounded text-white ${className}`}>
            {children}
        </div>
    );

    return (
        <div className="space-y-6 pt-4 text-gray-200">
            
            {/* 1. Product Name & Highlight */}
            <div className="flex justify-between items-center p-4 rounded-lg">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Product Name</label>
                    <h2 className="text-3xl font-extrabold text-white">{product.name}</h2>
                </div>
                {/* Highlight */}
                <div className="text-right">
                    <label className="block text-sm font-medium mb-1 text-yellow-400">Highlight</label>
                    <p className="text-sm italic text-yellow-300 max-w-xs">{highlight}</p>
                </div>
            </div>

            {/* 2. Tags & Category */}
            <div className="flex space-x-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2 text-gray-400">Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {productTags.map((tag, index) => (
                            <span 
                                key={index} 
                                className="px-3 py-1 bg-purple-700 text-white rounded-full text-xs font-medium hover:bg-purple-600"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="w-1/4">
                    <label className="block text-sm font-medium mb-2 text-gray-400">Category</label>
                    <ValueDisplay className="bg-gray-700 font-medium">
                        {product.category.name}
                    </ValueDisplay>
                </div>
            </div>

            {/* 3. Blurb */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Blurb</label>
                <ValueDisplay className="bg-gray-700 italic">
                    {product.blurb || '— ไม่มี Blurb —'}
                </ValueDisplay>
            </div>
            
            {/* 4. Product Description */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Product Description</label>
                <ValueDisplay className="bg-gray-700 whitespace-pre-wrap min-h-[120px] text-base">
                    {product.description}
                </ValueDisplay>
            </div>
            
            {/* 5. Features & Compatibility */}
            <div className="grid grid-cols-2 gap-6">
                {/* Features (max 6) */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">Key Features</label>
                    <div className="space-y-2">
                        {product.features.map((feature, index) => (
                            <ValueDisplay key={index} className="bg-gray-800 text-sm flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                {feature}
                            </ValueDisplay>
                        ))}
                        {/* หากมี feature ไม่ถึง 6 ให้แสดงช่องว่างแทน */}
                        {Array.from({ length: 6 - product.features.length }).map((_, index) => (
                            <ValueDisplay key={`empty-${index}`} className="bg-gray-800 text-gray-500 italic text-sm">
                                — ว่าง —
                            </ValueDisplay>
                        ))}
                    </div>
                </div>

                {/* Compatibility */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">Compatibility</label>
                    <div className="flex flex-wrap gap-2">
                        {compatibility.map((item, index) => (
                            <span 
                                key={index} 
                                className="px-3 py-1 bg-blue-700 text-white rounded text-sm font-medium"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. Price */}
            <div className="pt-4 border-t border-gray-700">
                <label className="block text-sm font-medium mb-2 text-gray-400">Price</label>
                <p className="p-3 bg-green-700 rounded text-white text-3xl font-extrabold w-1/3 text-center">
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