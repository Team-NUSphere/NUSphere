import { FiDownload } from "react-icons/fi";
import { getTimetableContext } from "../contexts/timetableContext";
import { handleDownload } from "../functions/exportTimetable";

const DownloadICSButton = () => {
  const { userClasses } = getTimetableContext();
  return (
    <button
      onClick={() => handleDownload(userClasses)}
      className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition-transform shadow-sm"
    >
      <FiDownload className="w-4 h-4" />
      <span>Download</span>
    </button>
  );
};

export default DownloadICSButton;
