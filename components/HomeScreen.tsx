import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionValue, useTransform } from 'framer-motion';
import { iOSSpring } from '../constants';
import { 
    Mail, Calendar,  Camera, Map, Clock, CloudSun, 
    Home, StickyNote, TrendingUp, BookOpen, AppWindow, 
    Phone, Compass, MessageCircle, Music, CloudRain,
    ChevronLeft, MoreHorizontal, Search, Plus, List, Share,
    Sun, Play, SkipForward, SkipBack, Heart
} from 'lucide-react';

interface AppConfig {
    id: number;
    name: string;
    icon: React.ElementType;
    gradient: string;
    isWidget?: boolean;
}

const GRID_APPS: AppConfig[] = [
    { id: 100, name: "Weather Widget", icon: CloudSun, gradient: "bg-gradient-to-br from-blue-400 to-blue-600", isWidget: true },
    { id: 1, name: "Calendar", icon: Calendar, gradient: "bg-white text-red-500" }, 
    { id: 2, name: "Photos", icon: AppWindow, gradient: "bg-white" }, 
    { id: 3, name: "Mail", icon: Mail, gradient: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { id: 4, name: "Camera", icon: Camera, gradient: "bg-gray-300 text-black" },
    { id: 5, name: "Maps", icon: Map, gradient: "bg-gradient-to-br from-green-400 to-blue-500" },
    { id: 6, name: "Clock", icon: Clock, gradient: "bg-black text-white" },
    { id: 7, name: "Weather", icon: CloudSun, gradient: "bg-gradient-to-b from-blue-400 to-blue-500" },
    { id: 8, name: "Home", icon: Home, gradient: "bg-gradient-to-br from-orange-400 to-yellow-500" },
    { id: 9, name: "Notes", icon: StickyNote, gradient: "bg-white text-yellow-500" },
    { id: 10, name: "Stocks", icon: TrendingUp, gradient: "bg-gray-900" },
    { id: 11, name: "Books", icon: BookOpen, gradient: "bg-orange-400" },
    { id: 12, name: "App Store", icon: AppWindow, gradient: "bg-gradient-to-br from-blue-500 to-blue-700" },
];

const DOCK_APPS: AppConfig[] = [
    { id: 91, name: "Phone", icon: Phone, gradient: "bg-green-500" },
    { id: 92, name: "Safari", icon: Compass, gradient: "bg-white text-blue-500" },
    { id: 93, name: "Messages", icon: MessageCircle, gradient: "bg-green-500" },
    { id: 94, name: "Music", icon: Music, gradient: "bg-red-500" },
];

interface HomeScreenProps {
  onAppOpenStateChange: (isOpen: boolean) => void;
  registerHomeAction: (action: () => void) => void;
  homeBarDragY: MotionValue<number>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onAppOpenStateChange, registerHomeAction, homeBarDragY }) => {
  const [activeAppId, setActiveAppId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    registerHomeAction(() => setActiveAppId(null));
  }, [registerHomeAction]);

  const handleAppClick = (id: number) => {
    setActiveAppId(id);
    onAppOpenStateChange(true);
  };

  const getActiveApp = () => {
      return [...GRID_APPS, ...DOCK_APPS].find(a => a.id === activeAppId);
  };

  const renderContent = () => {
      if (!activeAppId) return null;
      const app = getActiveApp();
      
      // Basic App UI Templates
      if (activeAppId === 100 || activeAppId === 7) return (
          <div className="w-full h-full bg-gradient-to-b from-[#1e3a8a] to-[#3b82f6] text-white p-6 pt-16 flex flex-col">
              <div className="text-center mt-8">
                  <h2 className="text-3xl font-medium">Cupertino</h2>
                  <h1 className="text-8xl font-thin mt-2">72°</h1>
                  <div className="text-xl font-medium mt-2 text-blue-100">Mostly Clear</div>
              </div>
              <div className="mt-12 bg-blue-500/20 backdrop-blur-md rounded-3xl p-4 overflow-x-auto no-scrollbar">
                  <div className="text-xs font-medium uppercase text-blue-200 mb-3 border-b border-white/10 pb-2">Hourly Forecast</div>
                  <div className="flex justify-between min-w-[300px]">
                      {['Now', '10AM', '11AM', '12PM'].map((time, i) => (
                          <div key={i} className="flex flex-col items-center gap-2"><span className="text-sm font-medium">{time}</span><CloudSun className="w-6 h-6 my-1" /><span className="text-lg font-bold">{72+i}°</span></div>
                      ))}
                  </div>
              </div>
          </div>
      );

      if (activeAppId === 94) return (
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black text-white p-6 pt-14 flex flex-col">
              <div className="w-full aspect-square bg-gray-800 rounded-2xl shadow-2xl mb-8 mt-4 overflow-hidden"><img src="https://picsum.photos/id/10/800/800" className="w-full h-full object-cover opacity-90" alt="Album" /></div>
              <h2 className="text-2xl font-bold">Starboy</h2><p className="text-lg text-gray-400 mb-6">The Weeknd</p>
              <div className="flex justify-between items-center px-4"><SkipBack className="w-10 h-10 fill-current" /><Play className="w-16 h-16 fill-current" /><SkipForward className="w-10 h-10 fill-current" /></div>
          </div>
      );

      if (activeAppId === 2) return (
           <div className="w-full h-full bg-white text-black pt-12 flex flex-col">
              <div className="px-5 pb-4 border-b border-gray-100 flex justify-between items-end"><h1 className="text-3xl font-bold">Photos</h1><Search className="w-6 h-6 text-blue-500" /></div>
              <div className="flex-1 overflow-y-auto pb-10"><div className="grid grid-cols-3 gap-0.5">{[...Array(24)].map((_, i) => (<div key={i} className="aspect-square bg-gray-100 overflow-hidden"><img src={`https://picsum.photos/id/${100 + i}/300/300`} className="w-full h-full object-cover" loading="lazy" /></div>))}</div></div>
           </div>
      );

      if (activeAppId === 3) return (
          <div className="w-full h-full bg-gray-50 pt-12 flex flex-col">
               <div className="px-4 py-2 flex justify-between text-blue-500 font-medium"><div><ChevronLeft className="w-6 h-6 inline" /> Mailboxes</div><div>Edit</div></div>
               <h1 className="text-3xl font-bold px-4 mb-2 text-black">Inbox</h1>
               <div className="flex-1 bg-white">{[1,2,3,4,5].map(i => (<div key={i} className="px-4 py-3 border-b border-gray-100"><h3 className="font-bold text-black">Sender {i}</h3><div className="text-sm text-gray-500">Subject line {i}</div></div>))}</div>
          </div>
      );

      // Generic App Fallback
      return (
          <div className={`w-full h-full ${app?.gradient.includes('bg-white') ? 'bg-gray-50 text-black' : 'bg-gray-900 text-white'} pt-14 flex flex-col items-center justify-center`}>
               <app!.icon className="w-24 h-24 mb-4 opacity-50" />
               <h1 className="text-3xl font-bold">{app?.name}</h1>
          </div>
      );
  };

  // Border Radius Logic:
  // - Defaults to 0 to fill the frame completely when open.
  // - Interpolates to rounded corners when dragged (swiped up).
  const appRadius = useTransform(homeBarDragY, [0, -100, -300], [0, isMobile ? 10 : 30, 20]);
  const appScale = useTransform(homeBarDragY, [0, -300], [1, 0.8]);
  const appY = useTransform(homeBarDragY, [0, -300], [0, -40]);

  return (
    <>
      <div className="pt-16 px-6 pb-32 h-full flex flex-col justify-between">
        <div className="grid grid-cols-4 gap-x-5 gap-y-6">
            {/* Widget */}
            <div className="col-span-2 row-span-2 relative group cursor-pointer" onTap={() => handleAppClick(100)}>
                <motion.div layoutId="app-icon-100" className="w-full h-full rounded-[26px] bg-gradient-to-b from-[#4084e4] to-[#1e3a8a] shadow-xl overflow-hidden p-4 text-white relative z-0" whileTap={{ scale: 0.95 }} transition={iOSSpring}>
                    <div className="flex flex-col justify-between h-full relative z-10 pointer-events-none">
                        <div><h3 className="text-base font-semibold">Cupertino</h3><h1 className="text-4xl font-light">72°</h1></div>
                        <div className="flex flex-col gap-1"><CloudRain className="w-6 h-6 mb-1" /><span className="text-xs font-medium">Mostly Clear</span></div>
                    </div>
                </motion.div>
                <motion.span animate={{ opacity: activeAppId === 100 ? 0 : 1 }} className="absolute -bottom-5 left-0 right-0 text-center text-[11px] font-medium text-white/90">Weather</motion.span>
            </div>

            {/* Grid Apps */}
            {GRID_APPS.filter(app => !app.isWidget).map((app) => (
                <motion.div key={app.id} className="flex flex-col items-center gap-1.5 cursor-pointer group" onTap={() => handleAppClick(app.id)} whileTap={{ scale: 0.9 }}>
                    <motion.div layoutId={`app-icon-${app.id}`} className={`w-[66px] h-[66px] rounded-[17px] ${app.gradient} shadow-lg flex items-center justify-center text-3xl overflow-hidden relative z-0`} transition={iOSSpring}>
                        {app.name === 'Calendar' ? (
                             <div className="w-full h-full bg-white flex flex-col items-center justify-center pt-2 pointer-events-none"><span className="text-red-500 text-[9px] font-bold uppercase">Mon</span><span className="text-black text-3xl font-light -mt-1">14</span></div>
                        ) : <app.icon className={`w-8 h-8 pointer-events-none ${app.gradient.includes('text-') ? '' : 'text-white'}`} strokeWidth={1.5} />}
                    </motion.div>
                    <motion.span animate={{ opacity: activeAppId === app.id ? 0 : 1 }} className="text-[11px] font-medium text-white/90 tracking-tight">{app.name}</motion.span>
                </motion.div>
            ))}
        </div>
        
        {/* Dock */}
        <div className="relative mt-auto">
            <div className="flex justify-center gap-2 mb-4"><div className="w-1.5 h-1.5 bg-white rounded-full" /><div className="w-1.5 h-1.5 bg-white/40 rounded-full" /></div>
            <div className="w-full h-[94px] bg-white/20 backdrop-blur-2xl rounded-[38px] flex items-center justify-around px-2 z-10 border border-white/10">
                {DOCK_APPS.map((app) => (
                    <motion.div key={app.id} className="flex flex-col items-center cursor-pointer" onTap={() => handleAppClick(app.id)} whileTap={{ scale: 0.9 }}>
                         <motion.div layoutId={`app-icon-${app.id}`} className={`w-[64px] h-[64px] rounded-[17px] ${app.gradient} shadow-lg flex items-center justify-center`} transition={iOSSpring}>
                             <app.icon className={`w-8 h-8 pointer-events-none ${app.gradient.includes('text-') ? '' : 'text-white'}`} strokeWidth={2} />
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Blocker */}
        {activeAppId !== null && <div className="absolute inset-0 z-30" />}

      {/* OPEN APP */}
      <AnimatePresence>
        {activeAppId !== null && (
          <motion.div
            key={activeAppId} 
            layoutId={`app-icon-${activeAppId}`}
            // Removed shadow-2xl to prevent edge artifacts
            className={`absolute inset-0 z-40 overflow-hidden ${getActiveApp()?.gradient || 'bg-white'}`}
            style={{ scale: appScale, borderRadius: appRadius, y: appY, originY: 1 }}
            transition={iOSSpring}
          >
             <motion.div className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.05 } }} transition={{ duration: 0.2 }}>
                 {renderContent()}
             </motion.div>
             {/* Note: Internal Home Indicator removed to avoid duplication with PhoneFrame's interactive one */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};