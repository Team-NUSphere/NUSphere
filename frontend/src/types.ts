export interface User {
  userId: string;
  username: string;
}

export interface Reply {
  replyId: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies: ReplyRecord;
}

export interface ReplyRecord {
  [replyId: string]: Reply;
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
}

export interface PostRecord {
  [postId: string]: Post;
}

export interface Group {
  groupId: string;
  groupName: string;
  description: string;
  postCount: number;
  createdAt: Date;
  ownerId: string;
  posts: Post[]; //not useful for now, it would be better to segregate what we can seperate
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
