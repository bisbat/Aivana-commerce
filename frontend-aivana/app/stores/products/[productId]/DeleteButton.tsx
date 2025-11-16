'use client';

import ConfirmModal from '@/components/common/ConfirmModal';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { deleteProductAction } from '@/lib/actions/product.actions';
import toast from 'react-hot-toast';

export default function DeleteButton({ productId }: { productId: string }) {
    const { isOpen, open, close, callback } = useConfirmModal();

    const handleDelete = async () => {
        await deleteProductAction(productId);
        toast.success("Product deleted successfully.");
        window.location.href = '/stores/products';
    };

    return (
        <>
            <button
                onClick={() => open(handleDelete)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
            >
                Delete
            </button>

            <ConfirmModal
                isOpen={isOpen}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => {
                    callback();
                    close();
                }}
                onCancel={close}
            />
        </>
    );
}
