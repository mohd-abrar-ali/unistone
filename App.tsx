import React, { useState, useEffect, useMemo, useContext } from 'react';
import { 
  Bell, Search, X, ShieldAlert, Play, Heart, Flame, Bot, MapPin, Send, User as UserIcon, Lock, 
  Mail, GraduationCap, Briefcase as BriefcaseIcon, LogOut, Plus, Users, 
  Calendar, FileText, Edit3, BookOpen, LayoutDashboard, MessageSquare, 
  Clock, ScanFace, CheckCircle, AlertCircle, PlaySquare, Image as ImageIcon, 
  Film, Save, Eye, Github, Linkedin, Network, Building, Zap, ArrowRight,
  TrendingUp, Globe, Smartphone, Laptop, Filter, Check, Camera, Upload,
  ExternalLink, ChevronRight, Book, Award, MoreVertical, FileUp, FileStack, Link as LinkIcon, FolderPlus, PlusCircle, Settings, PieChart, Trash2, Sliders, Palette, Target, BarChart3, Globe2, ShieldCheck, UserCheck, Activity, RefreshCw, Radio, Database, Menu, Info, UserPlus, Power, Ban, MousePointerClick, Settings2, Users2, Trophy, Map as MapIcon, Video as VideoIcon, Newspaper, XCircle, Share2
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, CampusEvent, Job, NewsArticle, Applicant, Lecture, Module } from './types';
import { NAV_ITEMS, MOCK_BUILDINGS, MOCK_COURSES, MOCK_VIDEOS, MOCK_EVENTS, MOCK_NEWS, MOCK_JOBS } from './constants';
import { askUnistoneAI } from './services/gemini';

// --- Theme Context ---
const ThemeContext = React.createContext('brand');

// --- Global State Persistence Hook ---
const useSyncedState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

let globalAttendanceSession: any = null;
let onAttendanceStarted: ((session: any) => void) | null = null;

// --- Authentication View ---
const AuthView = ({ onLogin, logo, studentList, facultyList }: { onLogin: (user: User) => void; logo: string; studentList: User[]; facultyList: User[] }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = 'brand'; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    
    const isAdmin = email.toLowerCase() === 'admin@unistone.edu';
    const finalRole = isAdmin ? UserRole.ADMIN : role;

    setTimeout(() => {
      let foundUser: User | undefined;
      
      if (finalRole === UserRole.ADMIN) {
           foundUser = {
              id: 'ADM-001',
              name: 'System Administrator',
              email: email,
              role: UserRole.ADMIN,
              department: 'Administration',
              xp: 0, streak: 0, attendance: 0,
              status: 'Active',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
           } as User;
      } else {
          const list = finalRole === UserRole.FACULTY ? facultyList : studentList;
          foundUser = list.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!foundUser) {
             // Simulate DB lookup success for new emails in demo
             if (email.includes('@')) {
                 foundUser = {
                    id: finalRole === UserRole.FACULTY ? `FAC-${Math.floor(Math.random()*1000)}` : `STU-${Math.floor(Math.random()*1000)}`,
                    name: email.split('@')[0],
                    email: email,
                    role: finalRole,
                    department: 'General',
                    xp: 0, streak: 0, attendance: 0,
                    status: 'Active',
                    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=400'
                 } as User;
             }
          }
      }

      if (foundUser) {
          if (foundUser.status === 'Suspended') {
              setError('Access Denied: Your account has been suspended. Contact Administration.');
              setLoading(false);
              return;
          }
          onLogin(foundUser);
      } else {
         setError('User not found. Please check your credentials.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden`}>
      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-${theme}-400/10 blur-[120px] rounded-full`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-${theme}-600/10 blur-[120px] rounded-full`} />

      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className={`md:w-1/2 p-12 text-white flex flex-col justify-between transition-all duration-700 bg-gradient-to-br from-${theme}-600 to-${theme}-500`}>
          <div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl overflow-hidden">
              {logo.length > 5 ? <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" /> : <span className={`font-black italic text-3xl text-${theme}-600`}>{logo}</span>}
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">UNISTONE</h1>
            <p className={`text-${theme}-100 text-lg font-medium leading-relaxed opacity-90 tracking-tight`}>Your Complete Digital Campus Ecosystem</p>
          </div>
          <div className="p-5 bg-white/10 rounded-[1.5rem] backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-center">
             Secure Campus Portal
          </div>
        </div>
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 uppercase">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Select your role to continue.</p>
          </div>
          {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                  <ShieldAlert size={16}/> {error}
              </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${role === UserRole.STUDENT ? `bg-${theme}-600 border-${theme}-600 text-white shadow-xl scale-105` : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                <GraduationCap size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Student</span>
              </button>
              <button type="button" onClick={() => setRole(UserRole.FACULTY)} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${role === UserRole.FACULTY ? `bg-${theme}-600 border-${theme}-600 text-white shadow-xl scale-105` : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                <BriefcaseIcon size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Faculty</span>
              </button>
            </div>
            
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="email" type="email" required placeholder="Email Address" className={`w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-${theme}-500 text-sm font-bold transition-all shadow-inner`} />
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="password" type="password" required placeholder="Password" className={`w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-${theme}-500 text-sm font-bold transition-all shadow-inner`} />
            </div>
            <button disabled={loading} className={`w-full py-5 text-white font-black rounded-2xl shadow-2xl transition-all uppercase text-[11px] tracking-widest mt-6 bg-${theme}-600 shadow-${theme}-500/20 active:scale-95 hover:bg-${theme}-700`}>
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Module: Tech News Hub ---
const TechNewsHub = ({ newsList }: { newsList: NewsArticle[] }) => {
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
    const theme = useContext(ThemeContext);

    // Filter mainly tech/engineering news or just show all in reverse chronological
    const displayNews = [...newsList].reverse();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
             <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-black uppercase leading-none tracking-tighter">Tech <span className={`text-${theme}-600`}>Hub</span></h2>
                    <p className="text-slate-400 font-bold italic mt-3 text-sm tracking-widest uppercase">Latest Campus & Tech News</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayNews.map(news => (
                    <div key={news.id} onClick={() => setSelectedArticle(news)} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-2xl hover:border-slate-200 transition-all cursor-pointer">
                        <div className="h-56 relative overflow-hidden">
                            <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={news.title} />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900">{news.category}</div>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-4 text-xs font-bold text-slate-400">
                                <span>{news.source}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"/>
                                <span>{news.readTime}</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">{news.title}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                                Read Article <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reading Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-12 animate-in fade-in">
                    <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-[3rem] overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="h-64 lg:h-80 relative shrink-0">
                            <img src={selectedArticle.image} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <button onClick={() => setSelectedArticle(null)} className="absolute top-8 right-8 p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"><X size={24}/></button>
                            <div className="absolute bottom-8 left-8 lg:left-12 max-w-2xl">
                                <span className={`px-4 py-2 bg-${theme}-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 inline-block`}>{selectedArticle.category}</span>
                                <h2 className="text-3xl lg:text-5xl font-black text-white leading-none tracking-tight">{selectedArticle.title}</h2>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center"><Newspaper size={24} className="text-slate-400"/></div>
                                        <div>
                                            <p className="font-bold text-slate-900">{selectedArticle.source}</p>
                                            <p className="text-xs text-slate-500 font-medium">{selectedArticle.readTime} read</p>
                                        </div>
                                    </div>
                                    <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 transition-all"><Share2 size={20}/></button>
                                </div>
                                <div className="prose prose-lg prose-slate max-w-none">
                                    <p className="text-xl font-medium text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-6 my-8">
                                        {selectedArticle.content ? selectedArticle.content.substring(0, 150) : "No summary available."}...
                                    </p>
                                    <p className="text-slate-800 leading-loose">
                                        {selectedArticle.content || "Full article content is not available in this demo. Imagine a comprehensive, well-researched article about the topic displayed here, providing students and faculty with the latest insights from the technology world."}
                                    </p>
                                    <p className="text-slate-800 leading-loose mt-4">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </p>
                                    <h4 className="text-2xl font-black text-slate-900 mt-8 mb-4">Key Takeaways</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 items-start"><CheckCircle className={`text-${theme}-600 shrink-0 mt-1`} size={20}/><span className="text-slate-700">Impact on future campus infrastructure.</span></li>
                                        <li className="flex gap-3 items-start"><CheckCircle className={`text-${theme}-600 shrink-0 mt-1`} size={20}/><span className="text-slate-700">New opportunities for student research.</span></li>
                                        <li className="flex gap-3 items-start"><CheckCircle className={`text-${theme}-600 shrink-0 mt-1`} size={20}/><span className="text-slate-700">Integration with existing Unistone systems.</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Module: Academic Hub (Courses) ---
const AcademicHub = ({ courses }: { courses: Course[] }) => {
    const theme = useContext(ThemeContext);
    
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
             <div>
                <h2 className="text-5xl font-black uppercase leading-none tracking-tighter">Academic <span className={`text-${theme}-600`}>Hub</span></h2>
                <p className="text-slate-400 font-bold italic mt-3 text-sm tracking-widest uppercase">Your Curriculum & Resources</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                         <div className="flex justify-between items-start mb-6">
                             <div>
                                 <span className={`px-4 py-2 bg-${theme}-50 text-${theme}-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-${theme}-100`}>{course.code}</span>
                                 <h3 className="text-3xl font-black text-slate-900 mt-4 leading-none">{course.name}</h3>
                             </div>
                             <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                 <BookOpen size={28}/>
                             </div>
                         </div>
                         <p className="text-slate-500 font-medium mb-8 line-clamp-2">{course.description}</p>
                         
                         <div className="space-y-4">
                             {course.modules?.slice(0, 2).map((module, idx) => (
                                 <div key={idx} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                                     <div className="flex items-center gap-4">
                                         <div className={`w-8 h-8 rounded-full bg-${theme}-100 flex items-center justify-center text-${theme}-600 font-bold text-xs`}>{idx + 1}</div>
                                         <span className="font-bold text-slate-700 text-sm">{module.title}</span>
                                     </div>
                                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{module.lectures?.length || 0} Lectures</span>
                                 </div>
                             ))}
                         </div>

                         <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                                     {course.instructorImage ? <img src={course.instructorImage} className="w-full h-full object-cover"/> : <UserIcon className="p-2 w-full h-full"/>}
                                 </div>
                                 <div>
                                     <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Instructor</p>
                                     <p className="font-bold text-slate-900 text-sm">{course.instructor}</p>
                                 </div>
                             </div>
                             <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">View Course</button>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Module: Connect Hub ---
const ConnectHub = ({ facultyList, studentList }: any) => {
  const [tab, setTab] = useState<'faculty' | 'community'>('faculty');
  const [search, setSearch] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const theme = useContext(ThemeContext);

  const displayList = tab === 'faculty' ? facultyList : studentList;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <h2 className="text-5xl font-black uppercase leading-none tracking-tighter">Campus <span className={`text-${theme}-600`}>Connect</span></h2>
           <p className="text-slate-400 font-bold italic mt-3 text-sm tracking-widest uppercase">Peer-to-Peer Directory</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm">
           <button onClick={() => setTab('faculty')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${tab === 'faculty' ? `bg-${theme}-600 text-white shadow-lg shadow-${theme}-500/20` : 'text-slate-400 hover:bg-slate-50'}`}>Faculty</button>
           <button onClick={() => setTab('community')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${tab === 'community' ? `bg-${theme}-600 text-white shadow-lg shadow-${theme}-500/20` : 'text-slate-400 hover:bg-slate-50'}`}>Students</button>
        </div>
      </div>

      <div className="relative max-w-xl">
         <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
         <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tab === 'faculty' ? 'faculty' : 'students'}...`} className={`w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-${theme}-500 transition-all shadow-sm`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayList.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase()) && item.status !== 'Suspended').map((item: any) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedProfile(item)}
            className={`bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:border-${theme}-200 transition-all hover:shadow-2xl cursor-pointer`}
          >
             <div className="flex items-center gap-6 mb-8">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-[2rem] object-cover shadow-inner group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500 ${tab === 'faculty' ? `bg-${theme}-50 text-${theme}-600` : 'bg-orange-50 text-orange-600'}`}>
                    {item.name[0]}
                    </div>
                )}
                <div>
                   <h4 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tighter">{item.name}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{item.role || item.department}</p>
                   {tab === 'faculty' && <p className={`text-[9px] font-bold text-${theme}-600 uppercase mt-1`}>Room: {item.block}</p>}
                </div>
             </div>
             <div className="space-y-4 pt-8 border-t border-slate-50">
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl">Contact</button>
             </div>
          </div>
        ))}
      </div>

      {/* Generic Profile Modal Overlay */}
      {selectedProfile && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className={`bg-white w-full max-w-2xl rounded-[5rem] overflow-hidden shadow-5xl border-[8px] border-${theme}-50 animate-in zoom-in-95 duration-500`}>
              <div className={`h-48 bg-gradient-to-r from-${theme}-600 to-${theme}-500 relative`}>
                 <button onClick={() => setSelectedProfile(null)} className="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl hover:bg-white/40 transition-all"><X size={24}/></button>
                 <div className="absolute -bottom-16 left-16">
                    {selectedProfile.image ? (
                        <img src={selectedProfile.image} className="w-40 h-40 rounded-[3.5rem] bg-white border-[8px] border-white shadow-3xl object-cover" />
                    ) : (
                        <div className={`w-40 h-40 rounded-[3.5rem] bg-white border-[8px] border-white shadow-3xl flex items-center justify-center font-black text-6xl text-${theme}-600 uppercase`}>
                        {selectedProfile.name[0]}
                        </div>
                    )}
                 </div>
              </div>
              <div className="p-20 pt-24 space-y-12 max-h-[70vh] overflow-y-auto custom-scrollbar no-scrollbar">
                 <div className="space-y-4">
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedProfile.name}</h3>
                    <p className={`text-xl font-bold text-${theme}-600 uppercase tracking-widest`}>{selectedProfile.role} • {selectedProfile.department}</p>
                    <p className="text-slate-500 font-medium italic text-lg leading-relaxed">{selectedProfile.bio || "No bio available."}</p>
                 </div>
                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Contact Information</h4>
                    <div className="flex flex-wrap gap-4">
                       <button className="flex-1 min-w-[200px] py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-[11px] flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 shadow-2xl">
                          <Mail size={20}/> Send Email
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Module: Profile View (Editable & Synced) ---
const ProfileView = ({ user, setUser, updateGlobalUser }: { user: User, setUser: any, updateGlobalUser: (u: User) => void }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<User>({ ...user });
  const [newSkill, setNewSkill] = useState('');
  const theme = useContext(ThemeContext);

  const saveProfile = () => {
    // 1. Update Local Session
    setUser(formData);
    // 2. Update Global Database (StudentList/FacultyList)
    updateGlobalUser(formData);
    setEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'coverImage') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData({ ...formData, [field]: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
        setFormData({
            ...formData,
            skills: [...(formData.skills || []), newSkill.trim()]
        });
        setNewSkill('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
         <div className="h-64 relative">
             <img src={formData.coverImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200"} className="w-full h-full object-cover" alt="Cover" />
             {editing && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <label className="cursor-pointer bg-white/20 backdrop-blur-md border border-white px-6 py-3 rounded-2xl text-white font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-white/30 transition-all">
                        <Camera size={20}/> Change Cover
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'coverImage')}/>
                    </label>
                 </div>
             )}
         </div>
         <div className="px-12 pb-12 relative">
            <div className="flex justify-between items-end -translate-y-20">
               <div className="w-48 h-48 rounded-[3rem] bg-white border-[8px] border-white shadow-2xl overflow-hidden relative group">
                  <img src={formData.image} className="w-full h-full object-cover" alt="Profile" />
                  {editing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <label className="cursor-pointer text-white font-bold uppercase tracking-widest flex flex-col items-center gap-2">
                            <Upload size={24}/> Upload
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')}/>
                        </label>
                    </div>
                  )}
               </div>
               <button onClick={() => editing ? saveProfile() : setEditing(true)} className="mb-6 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  {editing ? 'Save Changes' : 'Edit Profile'}
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
               <div className="space-y-8">
                  {editing ? (
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Full Name</label>
                          <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-${theme}-500 transition-all shadow-inner`} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Bio</label>
                          <textarea value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} className={`w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-sm h-32 outline-none focus:border-${theme}-500 transition-all shadow-inner resize-none`} />
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div>
                          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{formData.name}</h2>
                          <div className="flex items-center gap-3 mt-4">
                             <span className={`px-4 py-1.5 bg-${theme}-50 text-${theme}-600 text-[10px] font-black uppercase rounded-lg border border-${theme}-100`}>{formData.department}</span>
                             <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100">{formData.id}</span>
                          </div>
                       </div>
                       <p className="text-slate-500 font-medium italic text-lg leading-relaxed">{formData.bio || 'No bio available.'}</p>
                    </div>
                  )}
               </div>
               
               <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:border-orange-200 transition-all">
                        <Flame className="mx-auto text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={32} fill="currentColor"/>
                        <p className="text-3xl font-black leading-none text-slate-900">{formData.streak}</p>
                        <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Streak</p>
                     </div>
                     <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:border-${theme}-200 transition-all`}>
                        <Award className={`mx-auto text-${theme}-500 mb-3 group-hover:scale-110 transition-transform`} size={32} fill="currentColor"/>
                        <p className="text-3xl font-black leading-none text-slate-900">{formData.xp}</p>
                        <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">XP</p>
                     </div>
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:border-emerald-200 transition-all">
                        <ScanFace className="mx-auto text-emerald-500 mb-3 group-hover:scale-110 transition-transform" size={32}/>
                        <p className="text-3xl font-black leading-none text-slate-900">{formData.attendance}%</p>
                        <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Attn.</p>
                     </div>
                  </div>

                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-6 shadow-inner">
                     <h3 className={`text-xl font-black uppercase tracking-tight flex items-center gap-3`}><Laptop className={`text-${theme}-600`} size={24}/> Skills</h3>
                     <div className="flex flex-wrap gap-3">
                        {(formData.skills || []).map((s: string, idx: number) => (
                          <span key={idx} className="px-5 py-2.5 bg-white text-slate-600 text-[10px] font-black uppercase rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                              {s}
                              {editing && (
                                  <button onClick={() => {
                                      const newSkills = [...(formData.skills || [])];
                                      newSkills.splice(idx, 1);
                                      setFormData({...formData, skills: newSkills});
                                  }} className="ml-1 hover:text-red-500 transition-colors">
                                      <X size={12} />
                                  </button>
                              )}
                          </span>
                        ))}
                     </div>
                     {editing && (
                         <div className="flex gap-2 mt-4">
                             <input 
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter') addSkill() }}
                                placeholder="Add new skill..."
                                className={`flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-${theme}-500`}
                             />
                             <button onClick={addSkill} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl shadow-lg hover:bg-black transition-all">Add</button>
                         </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Sub-Module: Map View (Editable by Admin) ---
const MapView = ({ buildings, onUpdateBuilding }: { buildings: CampusBuilding[], onUpdateBuilding?: (b: CampusBuilding) => void }) => {
  const [selected, setSelected] = useState<any>(null);
  const theme = useContext(ThemeContext);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <h2 className="text-5xl font-black uppercase leading-none tracking-tighter">Campus <span className={`text-${theme}-600`}>Map</span></h2>
        
        <div className="h-[65vh] bg-slate-900 rounded-[4rem] border border-slate-100 relative overflow-hidden shadow-2xl group">
            <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                <div className={`absolute inset-0 bg-${theme}-900/20 mix-blend-overlay`} />
            </div>

            <div className="absolute inset-0 overflow-hidden">
                <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                    {buildings.map((b: any) => (
                    <div key={b.id} className={`absolute transition-all duration-700 ${selected?.id === b.id ? 'z-[100]' : 'z-10'}`} style={{ top: b.mapCoords.top, left: b.mapCoords.left }}>
                        <div onClick={() => setSelected(b)} className="group relative">
                        <div className={`w-16 h-16 ${b.color} rounded-full border-[4px] border-white shadow-[0_0_30px_rgba(0,0,0,0.3)] flex items-center justify-center text-white transition-all group-hover:scale-125 hover:z-50 cursor-pointer 
                            ${selected?.id === b.id ? 'ring-[8px] ring-white/50 scale-125 selected-pin-pulse shadow-[0_0_50px_rgba(255,255,255,0.5)]' : ''}`}>
                            <MapPin size={28} fill="currentColor"/>
                        </div>
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white px-6 py-3 rounded-2xl shadow-xl border border-slate-100 transition-all pointer-events-none whitespace-nowrap z-[60] 
                            ${selected?.id === b.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'}`}>
                            <p className="text-[12px] font-black uppercase tracking-tighter text-slate-900">{b.name}</p>
                            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
             {selected && (
                <div className="absolute bottom-10 right-10 w-[400px] bg-white/95 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-5xl overflow-hidden animate-in slide-in-from-right-16 duration-500 z-[100]">
                   <div className="h-48 relative group">
                      <img src={selected.image} className="h-full w-full object-cover" alt=""/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <button onClick={() => setSelected(null)} className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"><X size={20}/></button>
                      <div className="absolute bottom-6 left-8">
                         <h4 className="text-2xl font-black leading-none uppercase tracking-tighter text-white">{selected.name}</h4>
                      </div>
                   </div>
                   <div className="p-8 space-y-4 max-h-[300px] overflow-y-auto">
                      <p className="text-slate-600 text-sm font-medium leading-relaxed italic">{selected.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {selected.departments.map((d: string) => (
                           <span key={d} className="px-4 py-2 bg-slate-100 text-slate-700 text-[10px] font-black uppercase rounded-xl border border-slate-200">{d}</span>
                        ))}
                     </div>
                   </div>
                </div>
              )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {buildings.map((b: any) => (
                <div key={b.id} onClick={() => setSelected(b)} className={`cursor-pointer group relative overflow-hidden rounded-[3rem] border-2 transition-all ${selected?.id === b.id ? `border-${theme}-600 shadow-xl scale-[1.02]` : `border-slate-100 bg-white hover:border-${theme}-200`}`}>
                    <div className="h-40 bg-slate-100 relative">
                        <img src={b.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={b.name} />
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                    </div>
                    <div className="p-6">
                        <h4 className="text-lg font-black uppercase tracking-tighter leading-tight text-slate-900 mb-2">{b.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.departments.length} Departments</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

// --- Admin Dashboard (Synced) ---
const AdminDashboard = ({ 
  studentList, setStudentList, 
  facultyList, setFacultyList, 
  buildings, setBuildings, 
  logo, setLogo, 
  themeColor, setThemeColor,
  events, setEvents,
  jobs, setJobs,
  newsList, setNewsList,
  courses, setCourses
}: any) => {
    const [activeSection, setActiveSection] = useState<'users' | 'buildings' | 'campus' | 'academic' | 'reports' | 'settings'>('users');
    const [userTab, setUserTab] = useState<'students' | 'faculty'>('students');
    const [contentTab, setContentTab] = useState<'events' | 'jobs' | 'news'>('events');
    const [showUserModal, setShowUserModal] = useState(false);
    const [showBuildingModal, setShowBuildingModal] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<CampusBuilding | null>(null);
    const theme = useContext(ThemeContext);

    const [newUser, setNewUser] = useState<Partial<User>>({});
    const [newBuilding, setNewBuilding] = useState<Partial<CampusBuilding>>({});
    const [newItem, setNewItem] = useState<any>({}); 

    // Settings States
    const [maintenanceMode, setMaintenanceMode] = useSyncedState('settings-maintenance', false);
    const [registrationOpen, setRegistrationOpen] = useSyncedState('settings-registration', true);
    const [guestAccess, setGuestAccess] = useSyncedState('settings-guest', true);

    const handleAddUser = () => {
        const idPrefix = userTab === 'students' ? 'STU' : 'FAC';
        const list = userTab === 'students' ? studentList : facultyList;
        const setList = userTab === 'students' ? setStudentList : setFacultyList;
        
        const user: User = {
            id: `${idPrefix}-${Math.floor(Math.random()*1000)}`,
            name: newUser.name || 'New User',
            email: newUser.email || 'user@unistone.edu',
            role: userTab === 'students' ? UserRole.STUDENT : UserRole.FACULTY,
            department: newUser.department || 'General',
            status: 'Active',
            xp: 0, streak: 0, attendance: 0,
            image: newUser.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=400',
            ...newUser
        } as User;

        setList([...list, user]);
        setShowUserModal(false);
        setNewUser({});
    };

    const toggleUserStatus = (id: string, isStudent: boolean) => {
        const list = isStudent ? studentList : facultyList;
        const setList = isStudent ? setStudentList : setFacultyList;
        setList(list.map((u: User) => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    };

    const deleteUser = (id: string, isStudent: boolean) => {
        const list = isStudent ? studentList : facultyList;
        const setList = isStudent ? setStudentList : setFacultyList;
        setList(list.filter((u: User) => u.id !== id));
    };

    const handleSaveBuilding = () => {
        if (editingBuilding) {
            setBuildings(buildings.map((b: CampusBuilding) => b.id === editingBuilding.id ? { ...editingBuilding, ...newBuilding } : b));
        } else {
            const building: CampusBuilding = {
                id: String(buildings.length + 1),
                name: newBuilding.name || 'New Building',
                description: newBuilding.description || '',
                color: 'bg-blue-600',
                image: newBuilding.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
                floors: 3,
                departments: ['General'],
                facilities: [],
                authorities: [],
                mapCoords: { top: '50%', left: '50%' },
                ...newBuilding
            };
            setBuildings([...buildings, building]);
        }
        setShowBuildingModal(false);
        setEditingBuilding(null);
        setNewBuilding({});
    };

    const deleteBuilding = (id: string) => {
        setBuildings(buildings.filter((b: CampusBuilding) => b.id !== id));
    };

    const addItem = (type: 'event' | 'job' | 'news' | 'course') => {
      const id = Math.random().toString(36).substr(2, 9);
      if (type === 'event') setEvents([...events, { ...newItem, id, registeredCount: 0 }]);
      if (type === 'job') setJobs([...jobs, { ...newItem, id, applicants: [] }]);
      if (type === 'news') setNewsList([...newsList, { 
          ...newItem, 
          id, 
          date: 'Just now', 
          readTime: '3 min',
          category: newItem.category || 'Tech',
          image: newItem.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
          source: 'Admin'
        }]);
      if (type === 'course') setCourses([...courses, { ...newItem, id, enrolledStudents: [], modules: [] }]);
      setNewItem({});
    };

    const deleteItem = (id: string, type: 'event' | 'job' | 'news' | 'course') => {
      if (type === 'event') setEvents(events.filter((e: any) => e.id !== id));
      if (type === 'job') setJobs(jobs.filter((j: any) => j.id !== id));
      if (type === 'news') setNewsList(newsList.filter((n: any) => n.id !== id));
      if (type === 'course') setCourses(courses.filter((c: any) => c.id !== id));
    };

    const avgAttendance = Math.round(studentList.reduce((acc: number, curr: User) => acc + curr.attendance, 0) / (studentList.length || 1));
    const topStudent = studentList.reduce((prev: User, current: User) => (prev.xp > current.xp) ? prev : current, studentList[0] || {});

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-end">
                <div>
                   <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Admin <span className={`text-${theme}-600`}>Console</span></h2>
                   <p className="text-slate-400 font-bold italic mt-4 uppercase tracking-widest text-sm">System Configuration & Management</p>
                </div>
                <div className="flex bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm gap-2">
                    {['users', 'buildings', 'campus', 'academic', 'reports', 'settings'].map((s) => (
                        <button 
                            key={s} 
                            onClick={() => setActiveSection(s as any)} 
                            className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase transition-all ${activeSection === s ? `bg-slate-900 text-white` : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </header>

            {activeSection === 'users' && (
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <button onClick={() => setUserTab('students')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${userTab === 'students' ? `bg-${theme}-100 text-${theme}-700` : 'bg-white text-slate-500'}`}>Students</button>
                        <button onClick={() => setUserTab('faculty')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${userTab === 'faculty' ? `bg-${theme}-100 text-${theme}-700` : 'bg-white text-slate-500'}`}>Faculty</button>
                        <div className="flex-1"/>
                        <button onClick={() => setShowUserModal(true)} className={`px-6 py-3 bg-${theme}-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-${theme}-700 flex items-center gap-2`}>
                            <UserPlus size={16}/> Add {userTab === 'students' ? 'Student' : 'Faculty'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {(userTab === 'students' ? studentList : facultyList).map((u: User) => (
                            <div key={u.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-slate-200 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img src={u.image} className={`w-16 h-16 rounded-2xl object-cover ${u.status === 'Suspended' ? 'grayscale opacity-50' : ''}`} />
                                        {u.status === 'Suspended' && <div className="absolute inset-0 flex items-center justify-center"><Ban className="text-red-600" size={24}/></div>}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900">{u.name}</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{u.id} • {u.department}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${u.status === 'Suspended' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {u.status || 'Active'}
                                    </span>
                                    <button onClick={() => toggleUserStatus(u.id, userTab === 'students')} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 text-slate-500" title="Suspend/Activate">
                                        <Power size={18} />
                                    </button>
                                    <button onClick={() => deleteUser(u.id, userTab === 'students')} className="p-3 bg-red-50 rounded-xl hover:bg-red-100 text-red-500" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'buildings' && (
                <div className="space-y-8">
                     <div className="flex justify-end">
                        <button onClick={() => { setEditingBuilding(null); setNewBuilding({}); setShowBuildingModal(true); }} className={`px-6 py-3 bg-${theme}-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-${theme}-700 flex items-center gap-2`}>
                            <Plus size={16}/> Add Building
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {buildings.map((b: CampusBuilding) => (
                            <div key={b.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col gap-4 group hover:shadow-xl transition-all">
                                <div className="h-40 rounded-[1.5rem] overflow-hidden relative">
                                    <img src={b.image} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => { setEditingBuilding(b); setNewBuilding(b); setShowBuildingModal(true); }} className="p-2 bg-white/90 rounded-xl hover:bg-white text-slate-700"><Edit3 size={16}/></button>
                                        <button onClick={() => deleteBuilding(b.id)} className="p-2 bg-red-500/90 rounded-xl hover:bg-red-500 text-white"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 leading-none">{b.name}</h4>
                                    <p className="text-xs font-bold text-slate-400 mt-2 line-clamp-2">{b.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'campus' && (
                <div className="space-y-8">
                    <div className="flex gap-4">
                        {['events', 'jobs', 'news'].map((t) => (
                            <button key={t} onClick={() => setContentTab(t as any)} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${contentTab === t ? `bg-${theme}-600 text-white` : 'bg-white text-slate-400'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input placeholder="Title / Headline" className="p-3 rounded-xl border border-slate-200 outline-none text-sm font-bold" onChange={e => setNewItem({...newItem, title: e.target.value})} value={newItem.title || ''}/>
                        
                        {contentTab === 'news' ? (
                            <>
                                <input placeholder="Content / Summary" className="p-3 rounded-xl border border-slate-200 outline-none text-sm font-medium" onChange={e => setNewItem({...newItem, content: e.target.value})} value={newItem.content || ''}/>
                                <input placeholder="Category (e.g. Tech)" className="p-3 rounded-xl border border-slate-200 outline-none text-sm font-medium" onChange={e => setNewItem({...newItem, category: e.target.value})} value={newItem.category || ''}/>
                            </>
                        ) : (
                            <>
                                <input placeholder="Description" className="p-3 rounded-xl border border-slate-200 outline-none text-sm font-medium" onChange={e => setNewItem({...newItem, description: e.target.value})} value={newItem.description || ''}/>
                                <input placeholder="Location / Company" className="p-3 rounded-xl border border-slate-200 outline-none text-sm font-medium" onChange={e => setNewItem({...newItem, location: e.target.value, company: e.target.value})} value={newItem.location || newItem.company || ''}/>
                            </>
                        )}
                        <button onClick={() => addItem(contentTab === 'events' ? 'event' : contentTab === 'jobs' ? 'job' : 'news')} className="bg-slate-900 text-white rounded-xl font-black uppercase text-xs">Add {contentTab}</button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {(contentTab === 'events' ? events : contentTab === 'jobs' ? jobs : newsList).map((item: any) => (
                             <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-slate-200 transition-all">
                                <div>
                                    <h4 className="text-lg font-black text-slate-900">{item.title}</h4>
                                    <p className="text-xs text-slate-400 font-bold">{item.date || item.salary || item.category} • {item.location || item.company || item.source}</p>
                                </div>
                                <button onClick={() => deleteItem(item.id, contentTab === 'events' ? 'event' : contentTab === 'jobs' ? 'job' : 'news')} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                             </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeSection === 'academic' && (
                <div className="space-y-8">
                     <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input placeholder="Course Name" className="p-3 rounded-xl border border-slate-200 outline-none text-sm font-bold" onChange={e => setNewItem({...newItem, name: e.target.value})} value={newItem.name || ''}/>
                        <input placeholder="Course Code (CS101)" className="p-3 rounded-xl border border-slate-200 outline-none text-sm font-medium" onChange={e => setNewItem({...newItem, code: e.target.value})} value={newItem.code || ''}/>
                        <input placeholder="Instructor Name" className="p-3 rounded-xl border border-slate-200 outline-none text-sm font-medium" onChange={e => setNewItem({...newItem, instructor: e.target.value})} value={newItem.instructor || ''}/>
                        <button onClick={() => addItem('course')} className="bg-slate-900 text-white rounded-xl font-black uppercase text-xs">Add Course</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((c: Course) => (
                             <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 relative group hover:shadow-xl transition-all">
                                <h4 className="text-2xl font-black text-slate-900 leading-none mb-2">{c.code}</h4>
                                <p className="text-sm font-bold text-slate-500 mb-4">{c.name}</p>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><UserIcon size={12}/> {c.instructor}</div>
                                <button onClick={() => deleteItem(c.id, 'course')} className="absolute top-6 right-6 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                             </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reports and Settings sections remain... */}
            {activeSection === 'reports' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className={`w-14 h-14 bg-${theme}-50 rounded-2xl flex items-center justify-center text-${theme}-600 mb-6`}><Users2 size={28}/></div>
                        <h3 className="text-4xl font-black text-slate-900 mb-2">{avgAttendance}%</h3>
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Avg. Student Attendance</p>
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6"><Trophy size={28}/></div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{topStudent.name || 'N/A'}</h3>
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Top Performer ({topStudent.xp} XP)</p>
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6"><BarChart3 size={28}/></div>
                        <h3 className="text-4xl font-black text-slate-900 mb-2">{facultyList.length}</h3>
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Active Faculty Members</p>
                    </div>
                </div>
            )}

             {activeSection === 'settings' && (
                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3"><Palette size={24}/> Theme Customization</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {['brand', 'blue', 'violet', 'emerald', 'orange', 'rose'].map(color => (
                                <button 
                                    key={color} 
                                    onClick={() => setThemeColor(color)}
                                    className={`h-24 rounded-3xl bg-${color}-500 border-4 transition-all ${themeColor === color ? 'border-slate-900 scale-110 shadow-xl' : 'border-transparent hover:scale-105'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6 pt-10 border-t border-slate-50">
                        <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3"><ImageIcon size={24}/> App Branding</h3>
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-4">Logo URL</label>
                            <div className="flex gap-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl p-2 border border-slate-100"><img src={logo} className="w-full h-full object-contain"/></div>
                                <input value={logo} onChange={e => setLogo(e.target.value)} className="flex-1 bg-slate-50 rounded-2xl px-6 font-bold text-sm outline-none border border-slate-100 focus:border-slate-300" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALS */}
            {showUserModal && (
                <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-10 animate-in zoom-in-95 space-y-6">
                        <h3 className="text-2xl font-black uppercase">Add New {userTab}</h3>
                        <input placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm" onChange={e => setNewUser({...newUser, name: e.target.value})} />
                        <input placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm" onChange={e => setNewUser({...newUser, email: e.target.value})} />
                        <input placeholder="Department" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm" onChange={e => setNewUser({...newUser, department: e.target.value})} />
                        <div className="flex gap-3">
                            <button onClick={handleAddUser} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Create User</button>
                            <button onClick={() => setShowUserModal(false)} className="px-6 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

             {showBuildingModal && (
                <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] p-10 animate-in zoom-in-95 space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black uppercase">{editingBuilding ? 'Edit' : 'Add'} Building</h3>
                            <button onClick={() => setShowBuildingModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <input placeholder="Building Name" value={newBuilding.name || ''} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border border-slate-100 focus:border-blue-500 transition-all" onChange={e => setNewBuilding({...newBuilding, name: e.target.value})} />
                                <textarea placeholder="Description" value={newBuilding.description || ''} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm h-32 resize-none outline-none border border-slate-100 focus:border-blue-500 transition-all" onChange={e => setNewBuilding({...newBuilding, description: e.target.value})} />
                                <input placeholder="Image URL" value={newBuilding.image || ''} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border border-slate-100 focus:border-blue-500 transition-all" onChange={e => setNewBuilding({...newBuilding, image: e.target.value})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Top %" value={newBuilding.mapCoords?.top || ''} readOnly className="w-full p-4 bg-slate-100 rounded-2xl font-bold text-sm text-slate-500 cursor-not-allowed" />
                                    <input placeholder="Left %" value={newBuilding.mapCoords?.left || ''} readOnly className="w-full p-4 bg-slate-100 rounded-2xl font-bold text-sm text-slate-500 cursor-not-allowed" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><MousePointerClick size={14}/> Click on the map to set location</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Building Location</label>
                                <div 
                                    className="relative w-full h-80 bg-slate-200 rounded-[2rem] overflow-hidden cursor-crosshair group shadow-inner border-2 border-slate-100 hover:border-blue-400 transition-all"
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        setNewBuilding({
                                        ...newBuilding, 
                                        mapCoords: { top: `${y.toFixed(1)}%`, left: `${x.toFixed(1)}%` }
                                        });
                                    }}
                                >
                                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-80" />
                                    {newBuilding.mapCoords && (
                                        <div 
                                        className="absolute w-8 h-8 bg-blue-600 rounded-full border-4 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-xl flex items-center justify-center text-white"
                                        style={{ top: newBuilding.mapCoords.top, left: newBuilding.mapCoords.left }}
                                        >
                                            <MapPin size={14} fill="currentColor"/>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <button onClick={handleSaveBuilding} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-emerald-500 transition-all">Save Building</button>
                            <button onClick={() => setShowBuildingModal(false)} className="px-8 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs hover:bg-slate-200 transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Sub-Module: Sidebar Controller ---
const Sidebar = ({ activeTab, setActiveTab, user, onLogout, logo, theme }: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(() => {
    if (user.role === UserRole.ADMIN) {
      return [
        { id: 'admin-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      ];
    }
    // Shared Student/Faculty Items, slightly modified
    const common = [
        { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'navigation', label: 'Campus Map', icon: <MapIcon size={20} /> },
        { id: 'academic', label: 'Academic Hub', icon: <BookOpen size={20} /> },
        { id: 'technews', label: 'Tech News', icon: <Newspaper size={20} /> },
        { id: 'comms', label: 'Connect', icon: <MessageSquare size={20} /> },
        { id: 'profile', label: 'My Profile', icon: <UserIcon size={20} /> },
    ];
    
    return common;
  }, [user.role]);

  return (
    <>
      <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden fixed top-8 left-8 z-[1000] p-5 bg-white rounded-[1.5rem] shadow-2xl text-${theme}-600 border border-slate-100 active:scale-95 transition-all`}>
        {mobileOpen ? <X size={28} /> : <LayoutDashboard size={28} />}
      </button>

      <aside className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-[900] flex flex-col p-10 transition-transform duration-500 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-5 mb-16">
          <div className="w-12 h-12 bg-white rounded-[1.2rem] flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden">
            {logo.length > 5 ? <img src={logo} className="w-full h-full object-contain p-1" /> : <span className={`text-${theme}-600 font-black text-2xl`}>{logo}</span>}
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Unistone</span>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all group ${activeTab === item.id ? `bg-${theme}-600 text-white shadow-2xl shadow-${theme}-500/20` : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : `text-slate-300 group-hover:text-${theme}-500`}`}>{item.icon}</div>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-10 border-t border-slate-50 space-y-8">
          <div className="flex items-center gap-5 px-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 shadow-inner overflow-hidden">
               {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <UserIcon size={24} />}
            </div>
            <div className="overflow-hidden">
               <p className="text-[11px] font-black uppercase tracking-tighter truncate text-slate-900 leading-none">{user.name}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic opacity-60">{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all shrink-0">
            <LogOut size={22} /> Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

// --- Main Hub Controller ---
export function App() {
  const [user, setUser] = useState<User | null>(() => {
    try {
        const saved = localStorage.getItem('unistone-user');
        return saved ? JSON.parse(saved) : null;
    } catch(e) { return null; }
  });

  const [logo, setLogo] = useSyncedState('unistone-logo', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4pVMdWwEh3mqNQA2xeeDw4PLheK36bs5GZw&s');
  const [themeColor, setThemeColor] = useSyncedState('unistone-theme', 'brand');
  
  // GLOBAL STATE - Source of Truth
  const [buildings, setBuildings] = useSyncedState('unistone-buildings', MOCK_BUILDINGS);
  const [courses, setCourses] = useSyncedState('unistone-courses', MOCK_COURSES);
  const [facultyList, setFacultyList] = useSyncedState<User[]>('unistone-faculty', [
    { 
      id: 'FAC-001', 
      name: 'Dr. Alan Turing', 
      role: UserRole.FACULTY, 
      block: 'B Block', 
      status: 'Active', 
      bio: 'Visionary in the field of Artificial Intelligence.',
      image: 'https://images.unsplash.com/photo-1566492031773-4fbc7dddf5af?auto=format&fit=crop&q=80&w=400',
      email: 'alan@unistone.edu', department: 'CS', xp: 0, streak: 0, attendance: 0
    },
     { 
      id: 'FAC-002', 
      name: 'Dr. Neha Gupta', 
      role: UserRole.FACULTY, 
      block: 'I Block', 
      status: 'Active', 
      bio: 'Expert in Pharmaceutical Sciences.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      email: 'neha@unistone.edu', department: 'Pharmacy', xp: 0, streak: 0, attendance: 0
    }
  ]);
  const [mediaList, setMediaList] = useSyncedState<VideoType[]>('unistone-media', MOCK_VIDEOS);
  const [events, setEvents] = useSyncedState('unistone-events', MOCK_EVENTS);
  const [jobs, setJobs] = useSyncedState('unistone-jobs', MOCK_JOBS);
  const [newsList, setNewsList] = useSyncedState('unistone-news', MOCK_NEWS);
  const [studentList, setStudentList] = useSyncedState<User[]>('unistone-students', [
    { id: 'STU-001', name: 'Sarah Connor', status: 'Active', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', email: 'sarah@unistone.edu', role: UserRole.STUDENT, department: 'CS', xp: 1200, streak: 5, attendance: 92 },
    { id: 'STU-002', name: 'John Doe', status: 'Active', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', email: 'john@unistone.edu', role: UserRole.STUDENT, department: 'IT', xp: 800, streak: 2, attendance: 75 }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (user) localStorage.setItem('unistone-user', JSON.stringify(user));
    else localStorage.removeItem('unistone-user');
  }, [user]);

  useEffect(() => {
    onAttendanceStarted = (s) => { if (user?.role === UserRole.STUDENT) setSession(s); };
    return () => { onAttendanceStarted = null; };
  }, [user]);

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.ADMIN) setActiveTab('admin-dashboard');
      else setActiveTab('dashboard');
    }
  }, [user]);

  // Sync profile edits back to main lists
  const updateGlobalUser = (updatedUser: User) => {
      if (updatedUser.role === UserRole.FACULTY) {
          setFacultyList(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      } else {
          setStudentList(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      }
  };

  const theme = themeColor; 

  if (!user) return <AuthView onLogin={setUser} logo={logo} studentList={studentList} facultyList={facultyList} />;

  const renderContent = () => {
    // Admin View
    if (user.role === UserRole.ADMIN) {
      return (
          <AdminDashboard 
            studentList={studentList} setStudentList={setStudentList}
            facultyList={facultyList} setFacultyList={setFacultyList}
            buildings={buildings} setBuildings={setBuildings}
            logo={logo} setLogo={setLogo}
            themeColor={themeColor} setThemeColor={setThemeColor}
            events={events} setEvents={setEvents}
            jobs={jobs} setJobs={setJobs}
            newsList={newsList} setNewsList={setNewsList}
            courses={courses} setCourses={setCourses}
          />
      );
    }

    // Shared Views
    if (activeTab === 'navigation') return <MapView buildings={buildings} />;
    if (activeTab === 'profile') return <ProfileView user={user} setUser={setUser} updateGlobalUser={updateGlobalUser} />;
    if (activeTab === 'comms') return <ConnectHub facultyList={facultyList} studentList={studentList} />;
    if (activeTab === 'technews') return <TechNewsHub newsList={newsList} />;
    if (activeTab === 'academic') return <AcademicHub courses={courses} />;

    // Student/Faculty Dashboard
    if (activeTab === 'dashboard') {
        return (
            <div className="space-y-16 animate-in fade-in duration-500 pb-20">
               <header className="flex justify-between items-end">
                  <div>
                     <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">{user.role} <span className={`text-${theme}-600`}>Feed</span></h2>
                     <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Welcome back, {user.name}.</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="px-8 py-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-2xl transition-all"><Flame className="text-orange-500" fill="currentColor" size={32}/><p className="text-2xl font-black leading-none">{user.streak}</p></div>
                     <div className="px-8 py-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-2xl transition-all"><Award className={`text-${theme}-500`} fill="currentColor" size={32}/><p className="text-2xl font-black leading-none">{user.xp}</p></div>
                     <div className="px-8 py-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-2xl transition-all"><ScanFace className="text-emerald-500" size={32}/><div className="leading-none"><p className="text-2xl font-black">{user.attendance}%</p><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Attn</p></div></div>
                  </div>
               </header>

               {/* Dynamic Events from Admin */}
               <div className="space-y-6">
                    <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">Upcoming Events</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {events.slice(0,3).map((e: CampusEvent) => (
                             <div key={e.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 group hover:shadow-xl transition-all">
                                 <div className="h-40 rounded-2xl overflow-hidden mb-4 relative">
                                     <img src={e.image} className="w-full h-full object-cover" />
                                     <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">{e.date}</div>
                                 </div>
                                 <h4 className="text-lg font-black leading-none">{e.title}</h4>
                                 <p className="text-xs text-slate-400 font-bold mt-2">{e.location}</p>
                             </div>
                        ))}
                    </div>
               </div>

               {/* Dynamic Tech News from Admin */}
               <div className="space-y-6">
                    <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">Recent News</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {newsList.slice(0,2).map((n: NewsArticle) => (
                            <div key={n.id} onClick={() => setActiveTab('technews')} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex gap-4 cursor-pointer hover:border-slate-300 transition-all">
                                <img src={n.image} className="w-24 h-24 rounded-2xl object-cover" />
                                <div>
                                    <span className="text-[10px] font-black uppercase text-blue-600">{n.category}</span>
                                    <h4 className="text-lg font-black leading-tight mt-1 mb-2">{n.title}</h4>
                                    <span className="text-xs text-slate-400 font-bold">Read Article -></span>
                                </div>
                            </div>
                        ))}
                    </div>
               </div>
            </div>
        )
    }

    return (
      <div className="p-32 text-center bg-white rounded-[5rem] border-2 border-dashed border-slate-200 animate-in zoom-in-95 duration-700">
         <Bot size={80} className={`mx-auto text-${theme}-100 mb-10 animate-pulse`} />
         <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">System Initialization</h3>
         <p className="text-slate-400 font-bold italic mt-4 uppercase tracking-widest text-sm">Loading module: <span className={`text-${theme}-600`}>"{activeTab}"</span></p>
         <button onClick={() => setActiveTab('dashboard')} className={`mt-14 px-16 py-6 bg-${theme}-600 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-${theme}-500/30 hover:scale-105 transition-all active:scale-95`}>Go to Dashboard</button>
      </div>
    );
  };

  return (
    <ThemeContext.Provider value={themeColor}>
        <div className="min-h-screen gradient-bg">
        {session && <AttendancePopup session={session} onMark={() => setSession(null)} />}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} logo={logo} theme={themeColor} />
        <main className="md:ml-72 p-6 md:p-14 h-screen flex flex-col overflow-hidden relative">
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar no-scrollbar scroll-smooth">{renderContent()}</div>
        </main>
        <AIAssistant />
        </div>
    </ThemeContext.Provider>
  );
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useContext(ThemeContext);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await askUnistoneAI(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-32 right-10 w-96 h-[500px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[1000] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className={`p-6 bg-${theme}-600 text-white flex items-center gap-4`}>
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Bot size={24} />
             </div>
             <div>
                <h4 className="font-black uppercase tracking-tight text-lg leading-none">Unistone AI</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Campus Assistant</p>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
             {messages.length === 0 && (
                <div className="text-center text-slate-400 mt-10">
                   <Bot size={48} className="mx-auto mb-4 opacity-20"/>
                   <p className="text-sm font-bold">Ask me anything about Unistone University!</p>
                </div>
             )}
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${m.role === 'user' ? `bg-${theme}-600 text-white rounded-br-none` : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'}`}>
                     {m.text}
                  </div>
               </div>
             ))}
             {loading && (
                <div className="flex justify-start">
                   <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                   </div>
                </div>
             )}
             <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-white border-t border-slate-100">
             <div className="relative">
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="w-full pl-6 pr-14 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:shadow-inner transition-all border border-transparent focus:border-slate-200"
                />
                <button onClick={handleSend} disabled={loading} className={`absolute right-2 top-2 p-2 bg-${theme}-600 text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100`}>
                   <Send size={20} />
                </button>
             </div>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-10 right-10 p-5 bg-slate-900 text-white rounded-[2rem] shadow-2xl hover:scale-110 transition-all z-[1000] border-4 border-white group`}>
          {isOpen ? <X size={32} /> : <Bot size={32} className="group-hover:animate-bounce"/>}
      </button>
    </>
  );
};

const AttendancePopup = ({ session, onMark }: { session: any, onMark: () => void }) => (
  <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in">
     <div className="bg-white p-12 rounded-[4rem] text-center max-w-lg w-full relative overflow-hidden">
        <ScanFace size={64} className="mx-auto text-blue-600 mb-8" />
        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Attendance Active</h3>
        <button onClick={onMark} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all shadow-xl">Mark Present</button>
     </div>
  </div>
);