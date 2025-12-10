import React from 'react';
import { motion, PanInfo, MotionValue } from 'framer-motion';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  onHomeClick?: () => void;
  homeBarDragY?: MotionValue<number>;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, onHomeClick, homeBarDragY }) => {
  
  const handleDragEnd = (_: any, info: PanInfo) => {
    // Significantly reduced thresholds for easier/faster closing
    const isFastSwipe = info.velocity.y < -100; 
    const isFarSwipe = info.offset.y < -40;     

    // If dragged up fast or far enough, trigger home action
    if ((isFastSwipe || isFarSwipe) && onHomeClick) {
      onHomeClick();
    }
  };

  return (
    <div className="relative w-full h-full md:w-[420px] md:h-[860px] bg-black md:bg-[#0a0a0a] md:rounded-[68px] md:border-[14px] md:border-[#1a1a1a] md:shadow-2xl overflow-hidden mx-auto md:ring-4 md:ring-black/40 select-none">
      {/* Screen Content */}
      <div 
        className="w-full h-full bg-cover bg-center relative overflow-hidden"
        style={{ 
            // New Vibrant iOS-style Liquid Gradient Wallpaper
            backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
            backgroundColor: '#000'
        }}
      >
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-14 flex justify-between items-start pt-4 px-7 z-50 pointer-events-none text-white mix-blend-plus-lighter">
            <div className="font-semibold text-[15px] tracking-wide pl-2">9:41</div>
            <div className="flex gap-2 items-center pr-1">
                <Signal className="w-4 h-4 fill-current" />
                <Wifi className="w-4 h-4" strokeWidth={2.5} />
                <div className="relative">
                    <Battery className="w-6 h-6 text-white/90" />
                    <div className="absolute top-1.5 left-1 w-3.5 h-3 bg-white rounded-[1px]" />
                </div>
            </div>
        </div>

        {/* The actual App Content */}
        {children}
        
        {/* Bottom Bar Indicator - Swipeable Area */}
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center z-[150] touch-none">
            <motion.div 
                className="w-full h-full flex items-end justify-center pb-2 cursor-grab active:cursor-grabbing"
                style={{ 
                    y: homeBarDragY,
                    touchAction: 'none'
                }} 
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                whileTap={{ scale: 0.95 }}
            >
                 <div className="w-[130px] h-[5px] bg-white/90 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.3)] backdrop-blur-md mb-2" />
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;