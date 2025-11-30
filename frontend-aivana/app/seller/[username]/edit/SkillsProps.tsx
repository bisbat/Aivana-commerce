'use client';

interface SkillsProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function Skills({ skills, onChange }: SkillsProps) {

  function addSkill(newSkill: string) {
    const skill = newSkill.trim();
    if (!skill) return;

    if (skills.length >= 10) {
      alert("Max 10 skills allowed");
      return;
    }

    if (skills.includes(skill)) {
      alert("This skill already exists.");
      return;
    }

    onChange([...skills, skill]);
  }

  function removeSkill(index: number) {
    onChange(skills.filter((_, i) => i !== index));
  }

  return (
    <section>
      <h2 className="text-xl font-medium mb-4">Skills</h2>

      {/* Skill badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {skill}
            <button
              type="button"
              className="text-red-300 hover:text-red-400"
              onClick={() => removeSkill(index)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Add skill */}
      <div className="flex gap-2">
        <input
          type="text"
          id="newSkill"
          placeholder="Add a skill (max 10)"
          className="border rounded px-3 py-2 flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />

        <button
          type="button"
          onClick={() => {
            const input = document.getElementById("newSkill") as HTMLInputElement;
            addSkill(input.value);
            input.value = "";
          }}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Add
        </button>
      </div>
    </section>
  );
}
