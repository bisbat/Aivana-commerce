'use client';
export default function BackButton() {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <button onClick={handleBack} className=" text-white px-4 py-2 rounded shadow hover:text-gray-300">
            &larr; Back
        </button>
    );
}