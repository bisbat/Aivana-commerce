'use client';
export default function BackButton() {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <button onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded">
            Back
        </button>
    );
}