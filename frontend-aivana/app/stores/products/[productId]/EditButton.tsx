'use client';
export default function EditButton({ productId }: { productId: string }) {
    const handleEdit = () => {
        window.location.href = `/stores/products/${productId}/edit`;
    };

    return <button onClick={handleEdit} className="bg-blue-500 hover:bg-primary-hover text-white px-4 py-2 rounded shadow mx-4">Edit</button>;
}
