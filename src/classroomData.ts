import type { Classroom, Message, Role } from './types';
import { GROUP_MESSAGES } from './data';

const ROOMS: Record<string, Classroom> = {
  '9-a': { id: '9-a', name: 'Class 9-A', subtitle: 'Main classroom', memberCount: 38, unread: 3, initials: '9A' },
  '10-b': { id: '10-b', name: 'Class 10-B', subtitle: 'Main classroom', memberCount: 34, unread: 0, initials: '10B' },
  science: { id: 'science', name: 'Science Club', subtitle: 'Clubs & activities', memberCount: 22, unread: 1, initials: 'SC' },
  parents: { id: 'parents', name: 'Class 9-A Parents', subtitle: 'Parent community', memberCount: 31, unread: 2, initials: '9P' },
  faculty: { id: 'faculty', name: 'Teaching Faculty', subtitle: 'Staff room', memberCount: 48, unread: 0, initials: 'TF' },
  leaders: { id: 'leaders', name: 'School Leadership', subtitle: 'Management team', memberCount: 8, unread: 4, initials: 'SL' },
  principals: { id: 'principals', name: 'Principals Network', subtitle: 'Tenant administrators', memberCount: 12, unread: 1, initials: 'PN' },
};

const ROOM_IDS_BY_ROLE: Record<Role, string[]> = {
  parent: ['parents', '9-a'],
  student: ['9-a', 'science'],
  teacher: ['9-a', '10-b', 'faculty'],
  management: ['leaders', 'faculty', '9-a', '10-b'],
  admin: ['principals', 'leaders'],
};

export function getJoinedClassrooms(role: Role) {
  return ROOM_IDS_BY_ROLE[role].map(id => ROOMS[id]);
}

const SCIENCE_MESSAGES: Message[] = [
  { id: 'sc1', sender: 'Ms. Deepa Raj', senderRole: 'teacher', content: 'The robotics lab is open after school today. Bring your project notebooks.', time: '9:10 AM', isMe: false, read: true },
  { id: 'sc2', sender: 'Arjun S', senderRole: 'student', content: 'Can we test the line-following sensor today?', time: '9:18 AM', isMe: false, read: true },
  { id: 'sc3', sender: 'Ms. Deepa Raj', senderRole: 'teacher', content: 'Yes. I have kept the sensor kits ready for your team.', time: '9:22 AM', isMe: false, read: false },
];

const PARENT_MESSAGES: Message[] = [
  { id: 'p1', sender: 'Ms. Kavitha Nair', senderRole: 'teacher', content: 'A reminder that the parent-teacher meeting begins at 9 AM on Saturday.', time: 'Yesterday', isMe: false, read: true },
  { id: 'p2', sender: 'Ramesh Pillai', senderRole: 'parent', content: 'Thank you. Is there a separate time slot for each student?', time: '8:42 AM', isMe: false, read: true },
  { id: 'p3', sender: 'Ms. Kavitha Nair', senderRole: 'teacher', content: 'I have shared the individual time slots in the announcement.', time: '8:48 AM', isMe: false, read: false },
];

const STAFF_MESSAGES: Message[] = [
  { id: 'st1', sender: 'Mr. Rajiv Menon', senderRole: 'management', content: 'Please submit your mid-term question papers by Friday afternoon.', time: 'Yesterday', isMe: false, read: true },
  { id: 'st2', sender: 'Ms. Kavitha Nair', senderRole: 'teacher', content: 'Biology papers are ready for review.', time: '10:15 AM', isMe: false, read: true },
  { id: 'st3', sender: 'Mr. Rajiv Menon', senderRole: 'management', content: 'Thank you. Please upload them to the shared faculty folder.', time: '10:21 AM', isMe: false, read: false },
];

const LEADERSHIP_MESSAGES: Message[] = [
  { id: 'l1', sender: 'Super Admin', senderRole: 'admin', content: 'The October attendance report is ready for review.', time: 'Yesterday', isMe: false, read: true },
  { id: 'l2', sender: 'Mr. Rajiv Menon', senderRole: 'management', content: 'I will review the exceptions before the afternoon meeting.', time: '8:35 AM', isMe: false, read: true },
];

export function getClassroomMessages(classroomId: string): Message[] {
  if (classroomId === 'science') return SCIENCE_MESSAGES;
  if (classroomId === 'parents') return PARENT_MESSAGES;
  if (classroomId === 'faculty' || classroomId === '10-b') return STAFF_MESSAGES;
  if (classroomId === 'leaders' || classroomId === 'principals') return LEADERSHIP_MESSAGES;
  return GROUP_MESSAGES;
}
