import { useState } from "react";
import { FiXCircle } from "react-icons/fi";

type GroupTagInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export default function GroupTagInput({
  value,
  onChange,
  placeholder,
}: GroupTagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 outline-none resize-none transition-colors">
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-blue-500 hover:text-red-500"
          >
            <FiXCircle />
          </button>
        </span>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Add tag..."}
        className="flex-grow min-w-[100px] border-none outline-none bg-transparent text-sm"
      />
    </div>
  );
}
