import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import PhoneFrame from './components/PhoneFrame';
import DynamicIsland from './components/DynamicIsland';
import { HomeScreen } from './components/HomeScreen';
import { IslandState } from './types';
import { Music, PhoneIncoming, Zap, Timer, Sparkles, XCircle, Settings2, X } from 'lucide-react';
import { iOSSpring } from './constants';

const App: React.FC = () => {
  const [islandState, setIslandState] = useState<IslandState>(IslandState.IDLE);
  const [homeAction, setHomeAction] = useState<(() => void) | null>(null);
  const [showMobileControls, setShowMobileControls] = useState(false);
  
  // Shared MotionValue to link Home Bar gesture with App Window
  const homeBarDragY = useMotionValue(0);

  const handleGeminiTrigger = () => {
      setIslandState(IslandState.GEMINI);
      setShowMobileControls(false);
  };

  const triggerState = (state: IslandState) => {
      setIslandState(state);
      setShowMobileControls(false);
  };

  const registerHomeAction = useCallback((action: () => void) => {
    setHomeAction(() => action);
  }, []);

  const handleHomeClick = () => {
    if (homeAction) {
        homeAction();
    }
  };

  const ControlsContent = () => (
      <>
        <div className="space-y-2 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dynamic Island</h1>
            <p className="text-gray-400">Interactive Component</p>
        </div>

        <div className="bg-gray-900/50 md:bg-gray-900 p-2 md:p-6 rounded-2xl md:border border-gray-800 space-y-4 shadow-xl backdrop-blur-sm">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-4">Triggers</h2>
            
            <button 
                onClick={() => triggerState(IslandState.MEDIA)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${islandState === IslandState.MEDIA ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gray-800 hover:bg-gray-750 hover:border-gray-600 border border-transparent'}`}
            >
                <Music className="w-5 h-5" />
                <span className="font-medium">Play Music</span>
            </button>

            <button 
                onClick={() => triggerState(IslandState.CALL)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${islandState === IslandState.CALL ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gray-800 hover:bg-gray-750 hover:border-gray-600 border border-transparent'}`}
            >
                <PhoneIncoming className="w-5 h-5" />
                <span className="font-medium">Incoming Call</span>
            </button>

            <button 
                onClick={() => triggerState(IslandState.TIMER)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${islandState === IslandState.TIMER ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-gray-800 hover:bg-gray-750 hover:border-gray-600 border border-transparent'}`}
            >
                <Timer className="w-5 h-5" />
                <span className="font-medium">Start Timer</span>
            </button>

            <button 
                onClick={() => triggerState(IslandState.CHARGING)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${islandState === IslandState.CHARGING ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-gray-800 hover:bg-gray-750 hover:border-gray-600 border border-transparent'}`}
            >
                <Zap className="w-5 h-5" />
                <span className="font-medium">Connect Charger</span>
            </button>

                <div className="h-px bg-gray-700 my-4" />

            <button 
                onClick={handleGeminiTrigger}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${islandState === IslandState.GEMINI ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-gray-800 hover:bg-gray-750 hover:border-gray-600 border border-transparent'}`}
            >
                <Sparkles className="w-5 h-5" />
                <div className="text-left">
                    <span className="font-medium block">Ask Gemini</span>
                    <span className="text-xs opacity-60">AI Assistant Mode</span>
                </div>
            </button>

                <button 
                onClick={() => triggerState(IslandState.IDLE)}
                className="w-full flex items-center justify-center gap-2 p-3 mt-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
            >
                <XCircle className="w-4 h-4" />
                Reset to Idle
            </button>
        </div>
      </>
  );

  return (
    <div className="h-screen w-screen md:min-h-screen md:bg-neutral-950 flex flex-col items-center justify-center md:p-8 font-sans text-gray-200 overflow-hidden">
      
      <div className="relative w-full h-full md:w-auto md:h-auto flex md:gap-12 items-start justify-center">
        
        {/* The Phone Replica */}
        <PhoneFrame 
            onHomeClick={handleHomeClick} 
            homeBarDragY={homeBarDragY}
        >
            <DynamicIsland state={islandState} onStateChange={setIslandState} />
            
            <HomeScreen 
                onAppOpenStateChange={(isOpen) => { /* Optional */ }}
                registerHomeAction={registerHomeAction}
                homeBarDragY={homeBarDragY}
            />

            {/* Mobile "Control Center" Trigger */}
            <button 
                className="md:hidden absolute top-14 right-6 z-[60] p-2 bg-gray-800/50 backdrop-blur-md rounded-full text-white/70 hover:text-white"
                onClick={() => setShowMobileControls(true)}
            >
                <Settings2 className="w-5 h-5" />
            </button>
        </PhoneFrame>

        {/* Desktop Controls Panel */}
        <div className="hidden md:block w-80 space-y-6">
            <ControlsContent />
             <div className="text-xs text-gray-500 leading-relaxed">
                <strong>Interaction:</strong> 
                <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Click <strong>Grid Icons</strong> to open apps.</li>
                    <li>Drag <strong>Home Bar</strong> up to close apps.</li>
                    <li>Click <strong>Dynamic Island</strong> to expand.</li>
                </ul>
            </div>
        </div>

        {/* Mobile Controls Overlay */}
        <AnimatePresence>
            {showMobileControls && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowMobileControls(false)}
                    />
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="md:hidden absolute bottom-0 left-0 right-0 z-[201] bg-gray-900 rounded-t-[30px] p-6 pb-12 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-6" />
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Control Center</h2>
                            <button onClick={() => setShowMobileControls(false)} className="p-2 bg-gray-800 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <ControlsContent />
                    </motion.div>
                </>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default App;