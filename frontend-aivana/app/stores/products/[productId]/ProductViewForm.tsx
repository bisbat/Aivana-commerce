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

    // Helper Component เพื่อแสดงค่าในรูปแบบ View (ใช้พื้นหลังเข้ม ไม่มี border)
    const ValueDisplay = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
        <div className={`w-full p-3 bg-gray-800 rounded text-white ${className}`}>
            {children}
        </div>
    );

    // ข้อมูลจาก JSON ใหม่
    const productTags = product.category.name ? [product.category.name, 'Component', 'Frontend'] : ['Component', 'Frontend'];
    const compatibilityList = product.compatibility || [];

    // เนื่องจาก JSON ไม่มี 'highlights' ในระดับ root, จึงใช้ blurb/description แทนในการเน้นข้อมูล
    const highlightText = product.blurb || product.description;

    return (
        <div className="space-y-6 pt-4 text-gray-200">

            {/* 1. Product Name & Highlight (Blurb) */}
            <div className="flex items-start">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Product Name</label>
                    <h2 className="p-3 text-3xl font-extrabold text-white">{product.name}</h2>
                </div>
            </div>
            {/* Blurb as Highlight */}
            <div className="text max-w-sm">
                <label className="block text-sm font-medium mb-1 text-gray-400">Blurb</label>
                <p className="p-3 text-base font-semibold">{highlightText}</p>
            </div>

            {/* 2. Tags & Category */}
            <div className="flex space-x-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2 text-gray-400">Tags</label>
                    <div className="p-3 flex flex-wrap gap-2">
                        {productTags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-purple-700 text-white rounded-full text-xs font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="w-1/2">
                    <label className="block text-sm font-medium mb-2 text-gray-400">Category</label>
                    <ValueDisplay className="bg-gray-700 font-medium">
                        {product.category.name}
                    </ValueDisplay>
                </div>
            </div>

            {/* 3. Product Description */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Description</label>
                <ValueDisplay className="bg-gray-700 whitespace-pre-wrap min-h-[100px] text-base">
                    {product.description}
                </ValueDisplay>
            </div>

            {/* 4. Features & Compatibility */}
            <div className="grid grid-cols-2 gap-6">
                {/* Features */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">Key Features</label>
                    <div className="space-y-2">
                        {product.features.map((feature, index) => (
                            <ValueDisplay key={index} className="bg-gray-800 text-sm flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                {feature}
                            </ValueDisplay>
                        ))}
                    </div>
                </div>

                {/* Compatibility */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">Compatibility</label>
                    <div className="flex flex-wrap gap-2">
                        {compatibilityList.map((item, index) => (
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

            {/* 5. Installation Guide & Creation Date */}
            <div className="grid grid-cols-2 gap-6 pt-2 border-t border-gray-700">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">Installation Guide</label>
                    <ValueDisplay className="bg-gray-700 font-mono text-sm">
                        {product.installation_guide}
                    </ValueDisplay>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">Created Date</label>
                    <ValueDisplay className="bg-gray-700 text-sm">
                        {new Date(product.created_at).toLocaleDateString()}
                    </ValueDisplay>
                </div>
            </div>

            {/* 6. Price */}
            <div className="pt-4">
                <label className="block text-sm font-medium mb-2 text-gray-400">Price</label>
                <p className="p-3 rounded text-white text-md font-extrabold w-1/3">
                    ${product.price}
                </p>
            </div>
        </div>
    );
};

// 2. Tab: รูปภาพสินค้า (Product Images View)
const ProductImagesView = ({ product }: { product: Product }) => {

    // Helper Component เพื่อแสดงรูปภาพ
    const ImagePreview = ({ url, altText }: { url: string, altText: string }) => (
        <div className="w-full h-48 bg-gray-800 border border-gray-700 rounded flex items-center justify-center overflow-hidden">
            {url ? (
                // ใช้แท็ก <img> จริง
                <img 
                    src={url} 
                    alt={altText} 
                    className="object-cover w-full h-full" 
                />
            ) : (
                <span className="text-gray-500 text-sm">No Image Available</span>
            )}
        </div>
    );
    
    // ตรวจสอบว่ามี Gallery Images หรือไม่
    const detailImages = product.detail_images || [];
    const hasGalleryImages = detailImages.length > 0;
    
    return (
        <div className="space-y-6 pt-4 text-white">
            
            {/* -------------------- Hero Image -------------------- */}
            <div>
                <h3 className="text-xl font-bold mb-2">Hero Image (Main)</h3>
                <p className="text-sm text-gray-400 mb-2">
                    {/* Hero Image URL จะต้องถูกเพิ่มใน product object หากมี */}
                    <strong>Hero Image URL:</strong> {product.hero_image_url || '— N/A (Using first detail image as fallback) —'}
                </p>
                
                {/* แสดง Hero Image Preview (ใช้ hero_image_url หากมี หรือใช้รูปแรกจาก detail_images เป็น Fallback) */}
                <ImagePreview 
                    url={product.hero_image_url || (hasGalleryImages ? detailImages[0].url : '')} 
                    altText={`Hero image of ${product.name}`} 
                />
            </div>
            
            <hr className="border-gray-700"/>

            {/* -------------------- Gallery Images -------------------- */}
            <div>
                <h3 className="text-xl font-bold pt-4 mb-4">Gallery Images ({detailImages.length})</h3>
                
                {hasGalleryImages ? (
                    // ✅ วนลูปแสดงรูปภาพ Gallery ในรูปแบบ Grid
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {detailImages.map((detail, index) => (
                            <div key={detail.image_id || index} className="space-y-1">
                                <ImagePreview 
                                    url={detail.url} 
                                    altText={`Gallery image ${index + 1}`} 
                                    // ปรับความสูงสำหรับรูปย่อย
                                    className="h-32"
                                />
                                <p className="text-xs text-gray-400 truncate">
                                    {detail.path_image.split('/').pop()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    // แสดงข้อความเมื่อไม่มีรูปภาพ
                    <div className="p-6 bg-gray-800 rounded text-center">
                        <span className="text-gray-500">No additional gallery images available.</span>
                    </div>
                )}
            </div>

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
        </div>
    );
}