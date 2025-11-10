// app/stores/products/[productId]/ProductTabs.tsx
"use client";
import { useState } from 'react';
import { Product } from '@/lib/types/product'; // นำเข้า Product Interface

// ประเภทของแท็บ
type Tab = 'information' | 'images' | 'file';

export default function ProductView({ product }: { product: Product }) {
    // State สำหรับเก็บว่าแท็บไหนถูกเลือก
    const [activeTab, setActiveTab] = useState<Tab>('information');

    // ฟังก์ชันสำหรับเรนเดอร์เนื้อหาตามแท็บที่เลือก
    const renderContent = () => {
        switch (activeTab) {
            case 'information':
                // ส่วนนี้คือโค้ดแสดง Product Information เดิมของคุณ
                return (
                    <div className="text-sm space-y-4">
                        <p><strong>Blurb:</strong> {product.blurb}</p>
                        <p><strong>Category:</strong> {product.category.name}</p>
                        <div>
                            <strong>Product Description:</strong>
                            <div className="whitespace-pre-wrap mt-1 text-gray-700">{product.description}</div>
                        </div>
                        <p><strong>Price:</strong> {parseFloat(product.price).toFixed(2)} {product.category.name.includes("UI kit") ? 'Baht' : 'USD'}</p>
                        <div>
                            <strong>Features:</strong>
                            <ul className="list-disc list-inside ml-4 mt-1 text-gray-700">
                                {product.features.map((f, index) => (
                                    <li key={index}>{f}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'images':
                return <div>[เนื้อหา Product Images] Hero URL: {product.hero_image_url}</div>;
            case 'file':
                return <div>[เนื้อหา Product File] Path: {product.uploaded_file_path}</div>;
            default:
                return null;
        }
    };

    // ฟังก์ชันสำหรับกำหนด Style ของแท็บ
    const getTabClasses = (tabName: Tab) => {
        const base = "px-4 py-2 cursor-pointer hover:text-gray-700";
        if (activeTab === tabName) {
            return `${base} border-b-2 border-purple-600 font-semibold text-purple-600`;
        }
        return `${base} text-gray-500`;
    };

    return (
        <div>
            {/* Tab Navigation */}
            <div className="flex space-x-2 border-b mb-6">
                <span 
                    className={getTabClasses('information')} 
                    onClick={() => setActiveTab('information')} // 💡 onClick อยู่ใน Client Component นี้
                >
                    Product Information
                </span>
                <span 
                    className={getTabClasses('images')} 
                    onClick={() => setActiveTab('images')}
                >
                    Product Images
                </span>
                <span 
                    className={getTabClasses('file')} 
                    onClick={() => setActiveTab('file')}
                >
                    Product File
                </span>
            </div>

            {/* Content Area */}
            {renderContent()}
        </div>
    );
}