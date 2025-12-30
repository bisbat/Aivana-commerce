'use client';

import ConfirmModal from '@/components/common/ConfirmModal';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { deleteProductAction } from '@/lib/actions/product.actions';
import toast from 'react-hot-toast';
import { getAuthData } from '@/lib/actions/auth.actions';
import { useEffect,useState } from 'react';
import { useRouter } from "next/navigation";




export default function DeleteButton({ productId }: { productId: string }) {
        const router = useRouter()

    const [token, setToken] = useState<string>("");

    useEffect(() => {
        function fetchCurrentUser() {
            const auth = getAuthData();   // <-- รันแค่บน client
            setToken(auth?.accessToken || "");
        }
        fetchCurrentUser();
    }, []);


    const { isOpen, open, close, callback } = useConfirmModal();

    const handleDelete = async () => {
        await deleteProductAction(productId, token);

        toast.success("Product deleted successfully.");
        router.push(`/stores`);
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
