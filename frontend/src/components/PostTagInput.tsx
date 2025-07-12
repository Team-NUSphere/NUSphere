type PostTagInputProps = {
  availableTags: string[];
  selectedTags: string[];
  onChange: (newSelectedTags: string[]) => void;
};

export default function PostTagInput({
  availableTags = [],
  selectedTags = [],
  onChange,
}: PostTagInputProps) {
  const selectedSet = new Set(selectedTags);

  const toggleTag = (tag: string) => {
    if (selectedSet.has(tag)) {
      selectedSet.delete(tag);
    } else {
      selectedSet.add(tag);
    }
    onChange(Array.from(selectedSet));
  };

  return (
    <div className="flex flex-wrap gap-2 outline-none resize-none transition-colors">
      {availableTags.map((tag) => {
        const isSelected = selectedSet.has(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
              isSelected
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
