export enum UserRole {
  STUDENT = 'student',
  FACULTY = 'faculty',
  ADMIN = 'admin'
}

export interface Project {
  title: string;
  description: string;
  link: string;
}

export interface Applicant {
  studentId: string;
  studentName: string;
  studentImage?: string;
  appliedDate: string;
  status: 'pending' | 'shortlisted' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrollmentNo?: string;
  department: string;
  attendance: number;
  xp: number;
  streak: number;
  bio?: string;
  skills?: string[];
  projects?: Project[];
  githubUrl?: string;
  linkedinUrl?: string;
  profileImage?: string;
  image?: string;
  coverImage?: string;
  enrolledCourseIds?: string[];
  isSuspended?: boolean;
  status?: string;
  block?: string;
}

export interface Lecture {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'pending';
  type: 'lecture' | 'assignment' | 'reading' | 'quiz';
  url?: string;
  fileType?: string;
}

export interface Module {
  id: string;
  title: string;
  lectures: Lecture[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  instructorImage?: string;
  notesCount: number;
  lecturesCount: number;
  modules: Module[];
  description: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  type: 'short' | 'long';
  subject: string;
  department: string;
  uploadedBy: string;
  uploaderRole: UserRole;
  uploaderImage?: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  views: number;
  createdAt: string;
}

export interface CampusBuilding {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
  floors: number;
  departments: string[];
  facilities: string[];
  mapCoords: { top: string; left: string };
  authorities?: string[];
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  registeredCount: number;
  type: 'hackathon' | 'workshop' | 'competition' | 'cultural';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: 'full-time' | 'internship';
  location: string;
  salary?: string;
  tags: string[];
  niche: string;
  applicants: Applicant[];
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  category: string;
  url: string;
  image: string;
  content?: string;
  readTime: string;
}