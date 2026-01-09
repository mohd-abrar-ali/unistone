
import React from 'react';
import { LayoutDashboard, Map as MapIcon, BookOpen, Video as VideoIcon, Calendar, MessageSquare, Briefcase, User as UserIcon } from 'lucide-react';
import { CampusBuilding, Course, Video, CampusEvent, Job, NewsArticle, UserRole } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'navigation', label: 'Campus Mesh', icon: <MapIcon size={20} /> },
  { id: 'edustone', label: 'Edustone Hub', icon: <BookOpen size={20} /> },
  { id: 'videohub', label: 'Collaboration', icon: <VideoIcon size={20} /> },
  { id: 'events', label: 'Events Pulse', icon: <Calendar size={20} /> },
  { id: 'comms', label: 'Connect', icon: <MessageSquare size={20} /> },
  { id: 'careers', label: 'Career Mesh', icon: <Briefcase size={20} /> },
  { id: 'profile', label: 'Terminal', icon: <UserIcon size={20} /> },
];

export const MOCK_NEWS: NewsArticle[] = [
  { id: 'n1', title: 'The Future of Generative AI in Engineering', source: 'TechCrunch', category: 'Engineering', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop', url: '#', readTime: '5 min' },
  { id: 'n2', title: 'Quantum Computing Nodes Establish Record Sync', source: 'Wired', category: 'CS', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop', url: '#', readTime: '4 min' },
  { id: 'n3', title: 'New Biotech Mesh Speeds Up Drug Formulation', source: 'Nature', category: 'Pharmacy', image: 'https://images.unsplash.com/photo-1532187875605-7fe35803efbe?w=400&h=250&fit=crop', url: '#', readTime: '3 min' },
  { id: 'n4', title: 'Autonomous Campus Shuttles: A Pilot Program', source: 'The Verge', category: 'General', image: 'https://images.unsplash.com/photo-1519067758434-d13d7edd4a4a?w=400&h=250&fit=crop', url: '#', readTime: '6 min' },
];

export const MOCK_BUILDINGS: CampusBuilding[] = [
  { id: 'A', name: 'A Block (Admin)', color: 'bg-[#8B0000]', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop', description: 'Central hub for university management and registrar.', floors: 3, departments: ['Registry', 'Accounts'], facilities: ['ATM', 'Reception'], mapCoords: { top: '20%', left: '50%' } },
  { id: 'B', name: 'B Block (Tech)', color: 'bg-blue-600', image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&h=400&fit=crop', description: 'School of CS & Artificial Intelligence.', floors: 5, departments: ['CS', 'AI'], facilities: ['Server Hub', 'AI Lab'], mapCoords: { top: '35%', left: '40%' } },
  { id: 'D', name: 'D Block (Engineering)', color: 'bg-indigo-600', image: 'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?w=600&h=400&fit=crop', description: 'Advanced mechanical and electrical workshops.', floors: 4, departments: ['Mech', 'Civil'], facilities: ['CAD Lab', 'Fluid Lab'], mapCoords: { top: '45%', left: '30%' } },
];

export const MOCK_COURSES: Course[] = [
  { 
    id: 'c1', name: 'AI Node Architecture', code: 'CS301', instructor: 'Dr. Alan Turing', instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', 
    notesCount: 24, lecturesCount: 12, description: 'Deep dive into neural network synchronization protocols.',
    modules: [
      {
        id: 'm1',
        title: 'Week 1: Fundamentals of Mesh',
        lectures: [
          { id: 'l1', title: 'Mesh Topology 101', duration: '45:00', status: 'completed', type: 'lecture' },
          { id: 'l2', title: 'Gradient Descent Sync', duration: '52:00', status: 'completed', type: 'lecture' },
        ]
      },
      {
        id: 'm2',
        title: 'Week 2: Advanced Processing',
        lectures: [
          { id: 'l3', title: 'Convolutional Hubs', duration: '48:00', status: 'pending', type: 'lecture' }
        ]
      }
    ]
  },
  { 
    id: 'c2', name: 'Quantum Engineering', code: 'QE202', instructor: 'Prof. Feynman', instructorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    notesCount: 15, lecturesCount: 8, description: 'Application of quantum mechanics in modern infrastructure.',
    modules: [
      {
        id: 'm3',
        title: 'Module 1: Quantum Flows',
        lectures: [
          { id: 'l4', title: 'Qubit Flow Control', duration: '40:00', status: 'completed', type: 'lecture' },
          { id: 'l5', title: 'Superposition Logic', duration: '55:00', status: 'pending', type: 'lecture' }
        ]
      }
    ]
  }
];

export const MOCK_VIDEOS: Video[] = [
  { id: 'v1', title: 'How I built my first AI Agent', description: 'A student project overview.', type: 'short', subject: 'CS301', department: 'CS', uploadedBy: 'Sarah Connor', uploaderRole: UserRole.STUDENT, uploaderImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', videoUrl: '#', thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=700&fit=crop', likes: 140, views: 1200, createdAt: '2h ago' },
  { id: 'v2', title: 'Syncing Mesh Nodes in Real-time', description: 'Faculty masterclass excerpt.', type: 'short', subject: 'CS102', department: 'CS', uploadedBy: 'Dr. Alan Turing', uploaderRole: UserRole.FACULTY, uploaderImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', videoUrl: '#', thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=700&fit=crop', likes: 500, views: 3400, createdAt: '5h ago' }
];

export const MOCK_EVENTS: CampusEvent[] = [
  { id: 'e1', title: 'Sage Hackathon 2024', description: 'Build the next campus protocol.', date: 'Oct 24', time: '09:00 AM', location: 'B Block Hub', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', registeredCount: 450, type: 'hackathon' },
  { id: 'e2', title: 'Alumni Meet: The Builders', description: 'Connect with legends.', date: 'Nov 12', time: '05:00 PM', location: 'Aagan Terrace', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop', registeredCount: 890, type: 'cultural' }
];

export const MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Node Architect Intern', company: 'Google', type: 'internship', location: 'Remote', salary: '60k/mo', tags: ['React', 'Sync'], niche: 'Engineering', applicants: [] },
  { id: 'j2', title: 'ML Mesh Engineer', company: 'NVIDIA', type: 'full-time', location: 'Indore Hub', salary: '18 LPA', tags: ['Python', 'CUDA'], niche: 'CS', applicants: [] }
];
