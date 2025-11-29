'use client';
export default function EditButton({ sellerId }: { sellerId: string}) {
    const handleEdit = () => {
        window.location.href = `/seller/${sellerId}/edit`;
    };

    return (
        <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
            Edit
        </button>
    );
}