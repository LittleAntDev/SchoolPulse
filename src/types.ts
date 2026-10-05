export type Role = 'parent' | 'student' | 'teacher' | 'management' | 'admin';
export type Screen =
  | 'login'
  | 'home'
  | 'chat'
  | 'group-chat'
  | 'classroom-chat'
  | 'content'
  | 'homework'
  | 'calendar'
  | 'dashboard'
  | 'announcements';

export interface SchoolTheme {
  id: string;
  name: string;
  crest: string;
  primary: string;
  accent: string;
  footer: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  phone: string;
  school: SchoolTheme;
  childName?: string;
  avatar: string;
}

export interface Message {
  id: string;
  sender: string;
  senderRole: Role;
  content: string;
  time: string;
  isMe: boolean;
  read: boolean;
  attachment?: { type: 'pdf' | 'img' | 'yt'; name: string };
}

export interface Classroom {
  id: string;
  name: string;
  subtitle: string;
  memberCount: number;
  unread: number;
  initials: string;
}

export interface Notice {
  id: string;
  title: string;
  summary: string;
  time: string;
  read: boolean;
  priority: 'normal' | 'urgent';
  author: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  daysLeft: number;
  completed: boolean;
  classroom: string;
  description?: string;
  attachments?: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'holiday' | 'exam' | 'event' | 'vacation';
  description?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'pdf' | 'img' | 'yt';
  subject: string;
  classroom: string;
  size?: string;
  compressedSize?: string;
  thumbnail?: string;
  ytId?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  classrooms: string[];
  status: 'active' | 'inactive';
  phone: string;
}

export interface Stat {
  label: string;
  value: number;
  delta: number;
  icon: string;
}
