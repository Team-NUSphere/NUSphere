export const backendRaw = "localhost:3001"; // raw
export const backend = `http://${backendRaw}`; // api
// wss://backend/...
// To be delete, mock data for development

import type { UserClassType } from "./contexts/timetableContext"

// Mock data for all available classes across different modules
export const mockAllModuleClasses: UserClassType[] = [
  // CS1101 - Multiple lecture options
  {
    classId: 1,
    classNo: "1",
    day: "Monday",
    endTime: "10:00:00",
    lessonType: "Lecture",
    startTime: "08:00:00",
    venue: "LT19",
    moduleId: "CS1010S",
  },
  {
    classId: 2,
    classNo: "2",
    day: "Monday",
    endTime: "12:00:00",
    lessonType: "Lecture",
    startTime: "10:00:00",
    venue: "LT20",
    moduleId: "CS1010S",
  },
  {
    classId: 3,
    classNo: "3",
    day: "Wednesday",
    endTime: "10:00:00",
    lessonType: "Lecture",
    startTime: "08:00:00",
    venue: "LT21",
    moduleId: "CS1010S",
  },

  // CS1101 - Multiple tutorial options
  {
    classId: 4,
    classNo: "01",
    day: "Tuesday",
    endTime: "10:00:00",
    lessonType: "Tutorial",
    startTime: "09:00:00",
    venue: "COM1-0210",
    moduleId: "CS1010S",
  },
  {
    classId: 6,
    classNo: "03",
    day: "Thursday",
    endTime: "10:00:00",
    lessonType: "Tutorial",
    startTime: "09:00:00",
    venue: "COM1-0212",
    moduleId: "CS1010S",
  },

  // MA1521 - Multiple lecture options
  {
    classId: 7,
    classNo: "1",
    day: "Monday",
    endTime: "12:00:00",
    lessonType: "Lecture",
    startTime: "10:00:00",
    venue: "LT27",
    moduleId: "MA1521",
  },
  {
    classId: 8,
    classNo: "2",
    day: "Wednesday",
    endTime: "12:00:00",
    lessonType: "Lecture",
    startTime: "10:00:00",
    venue: "LT28",
    moduleId: "MA1521",
  },
  {
    classId: 9,
    classNo: "3",
    day: "Friday",
    endTime: "10:00:00",
    lessonType: "Lecture",
    startTime: "08:00:00",
    venue: "LT29",
    moduleId: "MA1521",
  },

  // MA1521 - Multiple tutorial options
  {
    classId: 10,
    classNo: "T01",
    day: "Tuesday",
    endTime: "12:00:00",
    lessonType: "Tutorial",
    startTime: "11:00:00",
    venue: "S17-0511",
    moduleId: "MA1521",
  },
  {
    classId: 11,
    classNo: "T02",
    day: "Thursday",
    endTime: "12:00:00",
    lessonType: "Tutorial",
    startTime: "11:00:00",
    venue: "S17-0512",
    moduleId: "MA1521",
  },
  {
    classId: 12,
    classNo: "T03",
    day: "Friday",
    endTime: "12:00:00",
    lessonType: "Tutorial",
    startTime: "11:00:00",
    venue: "S17-0513",
    moduleId: "MA1521",
  }
]