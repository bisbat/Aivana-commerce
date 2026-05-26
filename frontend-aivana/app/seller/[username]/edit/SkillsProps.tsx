"use client";

interface SkillsProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

const MAX_SKILLS = 10;

export function Skills({ skills, onChange }: SkillsProps) {
  function handleSkillChange(index: number, value: string) {
    const newSkills = [...skills];
    newSkills[index] = value;
    onChange(newSkills);
  }

  function removeSkill(index: number) {
    onChange(skills.filter((_, i) => i !== index));
  }

  function addSkill() {
    if (skills.length >= MAX_SKILLS) {
      alert("สามารถเพิ่มได้สูงสุด 10 ทักษะ");
      return;
    }
    onChange([...skills, ""]);
  }

  const displaySkills = skills.length > 0 ? skills : [""];

  return (
    <section>
      <label className="block text-white text-sm mb-2">ทักษะ</label>
      <div className="space-y-2">
        {displaySkills.map((skill, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
              placeholder="เช่น การออกแบบกราฟิก, การพัฒนาเว็บ"
              className="flex-1 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-[#8a57fb] text-white placeholder:text-slate-400 focus:outline-none transition-colors"
            />
            {displaySkills.length > 1 && (
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                ลบ
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSkill}
          disabled={skills.length >= MAX_SKILLS}
          className="w-full px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-lg border border-dashed border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + เพิ่มทักษะ ({skills.length}/{MAX_SKILLS})
        </button>
      </div>
    </section>
  );
}
