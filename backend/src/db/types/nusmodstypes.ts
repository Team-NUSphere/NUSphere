/* eslint-disable perfectionist/sort-object-types */
/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */
/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable perfectionist/sort-modules */

// from nusmods api
export type AcadYear = string; // E.g. "2016/2017"
export type ClassNo = string; // E.g. "1", "A"
export type DayText = string; // E.g. "Monday", "Tuesday"
export type Department = string;
export type StartTime = string; // E.g. "1400"
export type EndTime = string; // E.g. "1500"
export type Faculty = string;
export type LessonType = string; // E.g. "Lecture", "Tutorial"
export type LessonTime = StartTime | EndTime;
export type ModuleCode = string; // E.g. "CS3216"
export type ModuleTitle = string;
export type Semester = number; // E.g. 1/2/3/4. 3 and 4 means special sem i and ii.
export type Workload = string | number[];
export type Venue = string;

export type ModuleCondensed = Readonly<{
  moduleCode: ModuleCode;
  title: ModuleTitle;
  semesters: number[];
}>;

export interface WeekRange {
  end: string;
  // The start and end dates
  start: string;
  // Number of weeks between each lesson. If not specified one week is assumed
  // ie. there are lessons every week
  weekInterval?: number;
  // Week numbers for modules with uneven spacing between lessons. The first
  // occurrence is on week 1
  weeks?: number[];
}

export type Weeks = number[] | WeekRange;

// Recursive tree of module codes and boolean operators for the prereq tree
export type PrereqTree =
  | string
  | { and?: PrereqTree[]; or?: PrereqTree[]; nOf?: [number, PrereqTree[]] };

// Auxiliary data types
export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const WorkingDaysOfWeek: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DaysOfWeek: Day[] = [...WorkingDaysOfWeek, "Sunday"];

export type Time = "Morning" | "Afternoon" | "Evening";
export const TimesOfDay: Time[] = ["Morning", "Afternoon", "Evening"];

export type ModuleLevel = 1 | 2 | 3 | 4 | 5 | 6 | 8;
export const Semesters = [1, 2, 3, 4];

export type WorkloadComponent =
  | "Lecture"
  | "Tutorial"
  | "Laboratory"
  | "Project"
  | "Preparation";

// RawLesson is a lesson time slot obtained from the API.
// Usually ModuleCode and ModuleTitle has to be injected in before using in the timetable.
export type RawLesson = Readonly<{
  classNo: ClassNo;
  day: DayText;
  endTime: EndTime;
  lessonType: LessonType;
  startTime: StartTime;
  venue: Venue;
  weeks: Weeks;
  size: number;
}>;

// Semester-specific information of a module.
export interface SemesterData {
  // Exam
  examDate?: string;
  examDuration?: number;

  semester: Semester;
  timetable: RawLesson[];
}

export type NUSModuleAttributes = Partial<{
  year: boolean; // Year long
  su: boolean; // Can S/U (undergraduate)
  grsu: boolean; // Can S/U (graduate)
  ssgf: boolean; // SkillsFuture Funded
  sfs: boolean; // SkillsFuture series
  lab: boolean; // Lab based
  ism: boolean; // Independent study
  urop: boolean; // Undergraduate Research Opportunities Program
  fyp: boolean; // Honours / Final Year Project
  mpes1: boolean; // Included in Semester 1's Module Planning Exercise
  mpes2: boolean; // Included in Semester 2's Module Planning Exercise
}>;

// Information for a module for a particular academic year.
export interface ModuleType {
  acadYear: AcadYear;

  additionalInformation?: string;
  aliases?: ModuleCode[];

  attributes?: NUSModuleAttributes;
  corequisite?: string;
  corequisiteRule?: string;
  department: Department;

  // Additional info
  description?: string;
  faculty: Faculty;
  fulfillRequirements?: ModuleCode[];
  gradingBasisDescription?: string;

  // Basic info
  moduleCode: ModuleCode;

  moduleCredit: string;
  preclusion?: string;
  preclusionRule?: string;

  // Requisite tree
  prereqTree?: PrereqTree;
  // Requsites
  prerequisite?: string;
  prerequisiteAdvisory?: string;
  prerequisiteRule?: string;

  // Semester data
  semesterData: SemesterData[];

  title: ModuleTitle;
  workload?: Workload;
}
