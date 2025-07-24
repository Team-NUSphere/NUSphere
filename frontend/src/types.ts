export interface User {
  userId: string;
  username: string;
  telegramId?: string;
}

export interface Reply {
  commentId: string;
  uid: string;
  comment: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  Replies: Reply[];
  parentId: string;
  replies: number;
  username: string;
}

export interface Post {
  postId: string;
  title: string;
  details: string;
  createdAt: Date;
  groupName: string;
  groupId: string;
  likes: number;
  uid: string;
  views: number;
  isLiked: boolean;
  replies: number;
  tags: string[];
  username: string;
}

export interface Group {
  groupId: string;
  groupName: string;
  description: string;
  postCount: number;
  createdAt: Date;
  ownerId: string;
  posts: Post[]; //not useful for now, it would be better to segregate what we can seperate
  tags?: string[];
}

export interface Module {
  department: string;
  description: string;
  faculty: string;
  gradingBasis: string;
  lessonType: string[];
  moduleCredit: number;
  moduleId: string;
  title: string;
  defaultClasses: string[];
}

export interface Class {
  classId: number;
  classNo: string;
  day: string;
  endTime: Date;
  lessonType: string;
  moduleId: string;
  startTime: Date;
  venue: string;
  weeks: number[];
}

export interface Enrollment {
  classes: string[];
  id: string;
  moduleId: string;
  timetableId: string;
}

export interface UserEvent {
  day: string;
  description: string;
  endTime: Date;
  eventId: string;
  name: string;
  startTime: Date;
  timetableId: string;
  venue: string;
  weeks: number[];
}

export interface UserTimetable {
  timetableId: string;
  uid: string;
}

export interface Resource {
  resourceId: string;
  name: string;
  description: string;
  link: string;
}

export interface ResourceClusterType {
  clusterId: string;
  name: string;
  description: string;
  Resources: Resource[];
  groupId: string;
}

export interface SwapRequestType {
  status: "pending" | "fulfilled" | "cancelled" | "matched";
  id: string;
  moduleCode: string;
  lessonType: string;
  fromClassNo: string;
  toClassNos: string[];
}
