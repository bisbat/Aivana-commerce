"use client";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditProfileButtonProps {
  editPath: string;
}

export default function EditProfileButton({
  editPath,
}: EditProfileButtonProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(editPath);
  };

  return (
    <button
      onClick={handleEdit}
      className="px-5 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2 border border-slate-600 text-sm"
    >
      <Edit size={16} />
      <span>แก้ไขโปรไฟล์</span>
    </button>
  );
}
