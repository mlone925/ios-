import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Pause, 
  Play, 
  FastForward, 
  Rewind, 
  BatteryCharging, 
  Sparkles, 
  Send
} from 'lucide-react';
import { IslandState, Song, GeminiState } from '../types';
import { askGemini } from '../services/geminiService';
import { iOSSpring } from '../constants';

interface DynamicIslandProps {
  state: IslandState;
  onStateChange: (state: IslandState) => void;
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({ state, onStateChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [song] = useState<Song>({
    title: "Starboy",
    artist: "The Weeknd",
    cover: "https://picsum.photos/id/10/200/200"
  });
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Gemini State
  const [geminiState, setGeminiState] = useState<GeminiState>({
    status: 'idle',
    query: '',
    response: ''
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-collapse logic for some states
  useEffect(() => {
    if (state === IslandState.CHARGING) {
      setIsExpanded(true);
      const timer = setTimeout(() => {
        setIsExpanded(false);
        onStateChange(IslandState.IDLE);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, onStateChange]);

  // Focus input when Gemini opens
  useEffect(() => {
    if (state === IslandState.GEMINI && isExpanded && geminiState.status === 'listening') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [state, isExpanded, geminiState.status]);

  const toggleExpand = () => {
    // Some states shouldn't be manually toggled if they are purely notification based
    if (state === IslandState.IDLE) return;
    setIsExpanded(!isExpanded);
  };

  const handleGeminiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiState.query.trim()) return;

    setGeminiState(prev => ({ ...prev, status: 'thinking' }));
    
    const answer = await askGemini(geminiState.query);
    
    setGeminiState(prev => ({ ...prev, status: 'response', response: answer }));
  };

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const renderIdle = () => (
    <motion.div 
      className="flex justify-between items-center w-full h-full px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Intentionally empty or minimal indicators for idle */}
    </motion.div>
  );

  const renderMediaCompact = () => (
    <motion.div 
      className="flex justify-between items-center w-full h-full px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center gap-2">
        <img src={song.cover} alt="Cover" className="w-5 h-5 rounded-sm" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5 items-end h-3">
            {[1,2,3,4].map(i => (
                 <motion.div 
                    key={i}
                    className="w-1 bg-green-400 rounded-full"
                    animate={{ height: isPlaying ? [4, 12, 6, 12] : 4 }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                 />
            ))}
        </div>
      </div>
    </motion.div>
  );

  const renderMediaExpanded = () => (
    <motion.div 
      className="flex flex-col w-full h-full p-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <img src={song.cover} alt="Cover" className="w-14 h-14 rounded-xl shadow-lg" />
          <div>
            <h3 className="font-semibold text-lg leading-tight">{song.title}</h3>
            <p className="text-gray-400 text-sm">{song.artist}</p>
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>
      
      <div className="w-full bg-gray-600/50 h-1.5 rounded-full mb-6 overflow-hidden">
        <motion.div 
            className="h-full bg-white rounded-full" 
            initial={{ width: "0%" }}
            animate={{ width: "45%" }}
            transition={{ duration: 30, ease: "linear" }}
        />
      </div>

      <div className="flex justify-between items-center px-4 text-3xl">
         <Rewind className="w-8 h-8 fill-current text-gray-200 hover:scale-110 transition-transform" />
         {isPlaying ? (
             <Pause className="w-10 h-10 fill-current hover:scale-110 transition-transform" onClick={() => setIsPlaying(false)} />
         ) : (
             <Play className="w-10 h-10 fill-current hover:scale-110 transition-transform" onClick={() => setIsPlaying(true)} />
         )}
         <FastForward className="w-8 h-8 fill-current text-gray-200 hover:scale-110 transition-transform" />
      </div>
    </motion.div>
  );

  const renderGemini = () => (
    <motion.div 
        className="flex flex-col w-full h-full p-4 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
    >
        <div className="flex items-center gap-2 mb-2">
            <div className="relative">
                <Sparkles className={`w-5 h-5 ${geminiState.status === 'thinking' ? 'text-blue-400 animate-spin' : 'text-blue-500'}`} />
                {geminiState.status === 'thinking' && (
                    <div className="absolute inset-0 bg-blue-500 blur-md opacity-50 animate-pulse" />
                )}
            </div>
            <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">Gemini AI</span>
        </div>

        {geminiState.status === 'response' ? (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto no-scrollbar mb-2 text-sm leading-relaxed text-gray-100">
                    "{geminiState.response}"
                </div>
                <button 
                    onClick={() => setGeminiState({ ...geminiState, status: 'listening', query: '' })}
                    className="bg-gray-800 hover:bg-gray-700 text-xs py-2 rounded-full transition-colors"
                >
                    Ask another question
                </button>
            </div>
        ) : (
             <form onSubmit={handleGeminiSubmit} className="flex items-center gap-2 mt-1">
                <input 
                    ref={inputRef}
                    type="text" 
                    value={geminiState.query}
                    onChange={(e) => setGeminiState({ ...geminiState, query: e.target.value })}
                    placeholder="Ask anything..."
                    disabled={geminiState.status === 'thinking'}
                    className="flex-1 bg-transparent border-none outline-none text-base placeholder-gray-500 text-white"
                />
                <button 
                    type="submit" 
                    disabled={!geminiState.query || geminiState.status === 'thinking'}
                    className={`p-2 rounded-full ${geminiState.query ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'}`}
                >
                   {geminiState.status === 'thinking' ? (
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                       <Send className="w-4 h-4" />
                   )}
                </button>
            </form>
        )}
       
    </motion.div>
  );

  const renderCall = () => (
    <motion.div 
      className="flex items-center justify-between w-full h-full px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg font-bold">JD</div>
          <div>
              <p className="text-xs text-gray-400">iPhone</p>
              <p className="text-sm font-semibold">John Doe</p>
          </div>
       </div>
       <div className="flex gap-3">
           <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600">
               <Phone className="w-5 h-5 text-white rotate-[135deg]" />
           </div>
           <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center cursor-pointer hover:bg-green-600">
               <Phone className="w-5 h-5 text-white" />
           </div>
       </div>
    </motion.div>
  );

  const renderTimer = () => (
      <div className="w-full h-full flex items-center justify-between px-6">
           <div className="text-orange-400 font-medium">Timer</div>
           <div className="text-2xl font-mono font-bold text-orange-500">
               14:59
           </div>
           <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
               <Pause className="w-4 h-4 text-orange-500 fill-current" />
           </div>
      </div>
  );

  const renderCharging = () => (
      <div className="w-full h-full flex items-center justify-between px-6 text-green-400">
          <span className="font-medium">Charging</span>
          <div className="flex items-center gap-2">
              <span className="font-bold text-xl">85%</span>
              <BatteryCharging className="w-6 h-6" />
          </div>
      </div>
  );

  // ---------------------------------------------------------------------------
  // DIMENSIONS LOGIC
  // ---------------------------------------------------------------------------

  const getDimensions = () => {
    // Base idle dimensions
    const base = { width: 120, height: 35, borderRadius: 20 };

    if (state === IslandState.IDLE) return base;

    if (isExpanded) {
        switch (state) {
            case IslandState.MEDIA: return { width: 360, height: 180, borderRadius: 40 };
            case IslandState.CALL: return { width: 360, height: 80, borderRadius: 40 };
            case IslandState.TIMER: return { width: 340, height: 80, borderRadius: 40 };
            case IslandState.GEMINI: return { width: 340, height: geminiState.status === 'response' ? 220 : 90, borderRadius: 32 };
            default: return { width: 340, height: 160, borderRadius: 40 };
        }
    }

    // Compact Active States
    switch (state) {
        case IslandState.MEDIA: return { width: 200, height: 35, borderRadius: 20 };
        case IslandState.CALL: return { width: 200, height: 35, borderRadius: 20 };
        case IslandState.TIMER: return { width: 200, height: 35, borderRadius: 20 };
        case IslandState.GEMINI: return { width: 50, height: 50, borderRadius: 25 }; // Special circle shape for AI loading/listening if idle
        case IslandState.CHARGING: return { width: 220, height: 45, borderRadius: 25 };
        default: return base;
    }
  };

  const dimensions = getDimensions();

  return (
    // Changed to absolute to stay inside the phone frame, and z-50 to stay above opened apps
    <div className="absolute top-3 left-0 right-0 flex justify-center z-[100] pointer-events-none">
      <motion.div
        layout
        className="bg-black relative overflow-hidden pointer-events-auto shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
        style={{ originY: 0 }}
        initial={false}
        animate={{
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: dimensions.borderRadius,
        }}
        transition={iOSSpring}
        onClick={toggleExpand}
      >
        {/* The Camera Cutout - Always visible to maintain realism */}
        <div className="absolute top-[6px] right-[20%] w-20 h-20 pointer-events-none opacity-0">
             {/* This is a placeholder for the physical camera hardware simulation */}
        </div>

        {/* Content Renderers */}
        <AnimatePresence mode="wait">
            {state === IslandState.IDLE && (
                 <motion.div key="idle" className="w-full h-full">{renderIdle()}</motion.div>
            )}

            {state === IslandState.MEDIA && (
                <motion.div key="media" className="w-full h-full">
                    {isExpanded ? renderMediaExpanded() : renderMediaCompact()}
                </motion.div>
            )}

            {state === IslandState.CALL && (
                 <motion.div key="call" className="w-full h-full">
                     {isExpanded ? renderCall() : renderCall()} 
                     {/* Compact call is same as expanded but smaller/clipped in this simplified demo */}
                 </motion.div>
            )}

            {state === IslandState.TIMER && (
                 <motion.div key="timer" className="w-full h-full">
                     {renderTimer()}
                 </motion.div>
            )}

            {state === IslandState.CHARGING && (
                 <motion.div key="charging" className="w-full h-full">
                     {renderCharging()}
                 </motion.div>
            )}

            {state === IslandState.GEMINI && (
                <motion.div key="gemini" className="w-full h-full">
                    {isExpanded ? renderGemini() : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-blue-400 animate-spin-slow" />
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default DynamicIsland;