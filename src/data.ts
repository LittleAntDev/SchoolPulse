import type { User, Notice, Assignment, CalendarEvent, ContentItem, Teacher, Message } from './types';

export const SCHOOLS = {
  greenwood: {
    id: 'greenwood',
    name: 'Greenwood Public School',
    crest: 'GP',
    primary: '#2563EB',
    accent: '#10B981',
    footer: '© 2026 Greenwood Public School',
  },
  stannes: {
    id: 'stannes',
    name: "St. Anne's Academy",
    crest: 'SA',
    primary: '#7C2D12',
    accent: '#D97706',
    footer: "© 2026 St. Anne's Academy",
  },
};

export const DEMO_ACCOUNTS: User[] = [
  { id: 'p1', name: 'Priya Sharma', role: 'parent', phone: '9999999999', school: SCHOOLS.greenwood, childName: 'Arjun Sharma', avatar: 'PS' },
  { id: 's1', name: 'Arjun Sharma', role: 'student', phone: '8888888888', school: SCHOOLS.greenwood, avatar: 'AS' },
  { id: 't1', name: 'Ms. Kavitha Nair', role: 'teacher', phone: '7777777777', school: SCHOOLS.greenwood, avatar: 'KN' },
  { id: 'm1', name: 'Mr. Rajiv Menon', role: 'management', phone: '6666666666', school: SCHOOLS.greenwood, avatar: 'RM' },
  { id: 'a1', name: 'Super Admin', role: 'admin', phone: '5555555555', school: SCHOOLS.greenwood, avatar: 'SA' },
];

export const NOTICES: Notice[] = [
  { id: 'n1', title: 'Annual Sports Day – 15 Oct 2026', summary: 'All students must report in sports uniform by 7:30 AM. Parents are welcome to attend. Venue: School Ground A.', time: '2h ago', read: false, priority: 'urgent', author: 'Principal' },
  { id: 'n2', title: 'Mid-Term Exam Schedule Released', summary: 'Exams begin October 20. Timetable has been uploaded to the Notice Board. Download to share with your ward.', time: '1d ago', read: false, priority: 'normal', author: 'Exam Cell' },
  { id: 'n3', title: 'School Closed – Gandhi Jayanti', summary: 'School will remain closed on October 2 for Gandhi Jayanti. Classes resume October 3.', time: '3d ago', read: true, priority: 'normal', author: 'Admin Office' },
];

export const ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'Chapter 5 – Photosynthesis Worksheet', subject: 'Biology', dueDate: '02 Oct 2026', daysLeft: 1, completed: false, classroom: 'Class 9-A', description: 'Complete Q1-Q10 from the worksheet and draw a labelled diagram of a chloroplast.' },
  { id: 'a2', title: 'Algebra Problem Set 3', subject: 'Mathematics', dueDate: '04 Oct 2026', daysLeft: 3, completed: false, classroom: 'Class 9-A' },
  { id: 'a3', title: 'Essay: My Role Model', subject: 'English', dueDate: '28 Sep 2026', daysLeft: -2, completed: true, classroom: 'Class 9-A' },
  { id: 'a4', title: 'Map Work – Rivers of India', subject: 'Geography', dueDate: '07 Oct 2026', daysLeft: 6, completed: false, classroom: 'Class 9-A' },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Gandhi Jayanti', date: '2026-10-02', type: 'holiday' },
  { id: 'e2', title: 'Annual Sports Day', date: '2026-10-15', type: 'event' },
  { id: 'e3', title: 'Mid-Term Exams Begin', date: '2026-10-20', type: 'exam' },
  { id: 'e4', title: 'Dussehra Break', date: '2026-10-24', type: 'vacation' },
  { id: 'e5', title: 'Dussehra Break End', date: '2026-10-28', type: 'vacation' },
  { id: 'e6', title: 'Parent-Teacher Meeting', date: '2026-11-05', type: 'event' },
  { id: 'e7', title: 'Unit Test – Science', date: '2026-10-10', type: 'exam' },
  { id: 'e8', title: 'Diwali Vacation', date: '2026-11-10', type: 'vacation' },
];

export const CONTENT_ITEMS: ContentItem[] = [
  { id: 'c1', title: 'Photosynthesis – Complete Notes', type: 'pdf', subject: 'Biology', classroom: 'Class 9-A', size: '4.2 MB', compressedSize: '1.1 MB', uploadedBy: 'Ms. Kavitha Nair', uploadedAt: 'Today, 9:14 AM' },
  { id: 'c2', title: 'Quadratic Equations – Video Lesson', type: 'yt', subject: 'Mathematics', classroom: 'Class 9-A', ytId: 'dQw4w9WgXcQ', uploadedBy: 'Mr. Suresh Kumar', uploadedAt: 'Yesterday' },
  { id: 'c3', title: 'Cell Structure Diagram', type: 'img', subject: 'Biology', classroom: 'Class 9-A', size: '3.8 MB', compressedSize: '520 KB', uploadedBy: 'Ms. Kavitha Nair', uploadedAt: '28 Sep' },
  { id: 'c4', title: 'Algebra Formulae Sheet', type: 'pdf', subject: 'Mathematics', classroom: 'Class 9-A', size: '1.2 MB', compressedSize: '320 KB', uploadedBy: 'Mr. Suresh Kumar', uploadedAt: '27 Sep' },
  { id: 'c5', title: 'Map of India – Rivers', type: 'img', subject: 'Geography', classroom: 'Class 9-B', size: '5.1 MB', compressedSize: '890 KB', uploadedBy: 'Ms. Preethi Iyer', uploadedAt: '26 Sep' },
];

export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Ms. Kavitha Nair', subject: 'Biology', classrooms: ['Class 9-A', 'Class 10-B'], status: 'active', phone: '7777777777' },
  { id: 't2', name: 'Mr. Suresh Kumar', subject: 'Mathematics', classrooms: ['Class 9-A', 'Class 9-B', 'Class 10-A'], status: 'active', phone: '7777777778' },
  { id: 't3', name: 'Ms. Preethi Iyer', subject: 'Geography', classrooms: ['Class 9-B', 'Class 10-B'], status: 'active', phone: '7777777779' },
  { id: 't4', name: 'Mr. Anand Pillai', subject: 'English', classrooms: ['Class 9-A', 'Class 9-B'], status: 'inactive', phone: '7777777770' },
  { id: 't5', name: 'Ms. Deepa Raj', subject: 'Physics', classrooms: ['Class 10-A', 'Class 10-B'], status: 'active', phone: '7777777771' },
];

export const DM_MESSAGES: Message[] = [
  { id: 'm1', sender: 'Ms. Kavitha Nair', senderRole: 'teacher', content: 'Hi Priya! Arjun did very well in today\'s practical. He explained the experiment clearly to the class.', time: '10:32 AM', isMe: false, read: true },
  { id: 'm2', sender: 'You', senderRole: 'parent', content: 'That\'s wonderful to hear! He has been studying hard all week.', time: '10:45 AM', isMe: true, read: true },
  { id: 'm3', sender: 'Ms. Kavitha Nair', senderRole: 'teacher', content: 'Please remind him to submit the photosynthesis worksheet by tomorrow. He\'s one of the few who haven\'t submitted yet.', time: '10:47 AM', isMe: false, read: true },
  { id: 'm4', sender: 'You', senderRole: 'parent', content: 'Oh, I didn\'t know! I\'ll make sure he completes it tonight. Thank you for letting me know.', time: '11:02 AM', isMe: true, read: true },
  { id: 'm5', sender: 'Ms. Kavitha Nair', senderRole: 'teacher', content: 'Of course! He can also check the notes I just uploaded to the content library.', time: '11:05 AM', isMe: false, read: false },
];

export const GROUP_MESSAGES: Message[] = [
  { id: 'g1', sender: 'Ms. Kavitha Nair', senderRole: 'teacher', content: '📌 Reminder: Mid-term exams start October 20. Study schedule shared in notices.', time: 'Yesterday', isMe: false, read: true },
  { id: 'g2', sender: 'Priya Sharma', senderRole: 'parent', content: 'Thank you Ms. Kavitha! Will Arjun receive a printed timetable?', time: 'Yesterday', isMe: false, read: true },
  { id: 'g3', sender: 'Ms. Kavitha Nair', senderRole: 'teacher', content: 'Yes, timetables will be distributed tomorrow morning.', time: 'Yesterday', isMe: false, read: true },
  { id: 'g4', sender: 'Ramesh Pillai', senderRole: 'parent', content: 'Can the timetable also be shared as a PDF here?', time: '9:15 AM', isMe: false, read: true },
  { id: 'g5', sender: 'Ms. Kavitha Nair', senderRole: 'teacher', content: 'Already uploaded to Content Library under "Exam Resources" 📄', time: '9:18 AM', isMe: false, read: true, attachment: { type: 'pdf', name: 'Exam_Timetable_Oct2026.pdf' } },
  { id: 'g6', sender: 'You', senderRole: 'parent', content: 'Thank you! Very helpful.', time: '9:45 AM', isMe: true, read: true },
  { id: 'g7', sender: 'Arjun S', senderRole: 'student', content: 'Ma\'am, is the Biology practical included in mid-terms?', time: '10:02 AM', isMe: false, read: false },
];

export const UPLOAD_STATS = [
  { month: 'Jul', uploads: 42 },
  { month: 'Aug', uploads: 78 },
  { month: 'Sep', uploads: 65 },
  { month: 'Oct', uploads: 91 },
];

export const CLASSROOMS_DATA = [
  { name: '9-A', students: 34 },
  { name: '9-B', students: 31 },
  { name: '10-A', students: 36 },
  { name: '10-B', students: 29 },
  { name: '8-A', students: 38 },
];
