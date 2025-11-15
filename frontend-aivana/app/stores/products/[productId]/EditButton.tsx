'use client';
export default function EditButton({ productId }: { productId: string }) {
    const handleEdit = () => {
        window.location.href = `/stores/products/${productId}/edit`;
    };

    return <button onClick={handleEdit} className="bg-red-500 text-white px-4 py-2 rounded">Edit</button>;
}
