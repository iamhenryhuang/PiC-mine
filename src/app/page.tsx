import ChatInterface from '@/components/ChatInterface';
import { Cpu, Zap, ShieldCheck, MonitorPlay } from 'lucide-react';

export default function Home() {
  return (
    <main className="h-screen w-full mesh-bg relative overflow-hidden flex flex-col items-center py-6 md:py-8 lg:py-10 bg-black text-white selection:bg-primary/30 font-sans">

      {/* HUD Overlay - Holo Borders */}
      <div className="fixed inset-0 pointer-events-none z-50 p-6 md:p-10 flex flex-col justify-between">
        {/* Top Border */}
        <div className="w-full h-px bg-white/10 relative">
          <div className="absolute left-0 top-0 w-20 h-0.5 bg-primary/50"></div>
          <div className="absolute right-0 top-0 w-20 h-0.5 bg-primary/50"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-40 h-[2px] bg-white/20"></div>
        </div>

        {/* Side Brackets */}
        <div className="absolute left-6 top-20 bottom-20 w-px bg-white/5 flex flex-col justify-center gap-20">
          <div className="w-1 h-10 bg-primary/30"></div>
          <div className="w-1 h-10 bg-primary/30"></div>
        </div>
        <div className="absolute right-6 top-20 bottom-20 w-px bg-white/5 flex flex-col justify-center gap-20 items-end">
          <div className="w-1 h-10 bg-primary/30"></div>
          <div className="w-1 h-10 bg-primary/30"></div>
        </div>

        {/* Bottom Status */}
        <div className="w-full flex justify-between items-end text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <div className="flex gap-4">
            <span>COORD: 34.05.22</span>
            <span>SEC: LEVEL_5</span>
          </div>
          <div className="h-px flex-1 mx-4 bg-white/10"></div>
          <div>STATUS: OPTIMAL</div>
        </div>
      </div>

      {/* Liquid Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-blue-600/20 rounded-full blur-[100px] animate-blob mix-blend-overlay" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-overlay" />
        <div className="absolute top-[30%] left-[30%] w-[50vw] h-[50vw] bg-pink-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col h-full px-4 gap-6 md:gap-8">

        {/* Compact Hero Section */}
        <div className="text-center space-y-4 shrink-0 transition-opacity duration-1000 ease-out animate-in fade-in zoom-in-95">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/60">System Ready</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-2xl glitch-text cursor-default select-none" data-text="BUILD YOUR DREAM">
            BUILD YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">DREAM</span>
          </h1>

          <div className="hidden md:flex flex-wrap justify-center gap-4 text-xs font-medium text-blue-200/60 opacity-80">
            <div className="px-4 py-1.5 border border-white/10 rounded bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-wider font-mono text-[10px]">
              [SPEED_OPTIMIZED]
            </div>
            <div className="px-4 py-1.5 border border-white/10 rounded bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-wider font-mono text-[10px]">
              [COMPATIBILITY_CHECK]
            </div>
            <div className="px-4 py-1.5 border border-white/10 rounded bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-wider font-mono text-[10px]">
              [AI_ARCHITECTURE]
            </div>
          </div>
        </div>

        {/* Chat Interface - Flex Grow to fill space */}
        <div className="flex-1 w-full min-h-0 perspective-1000 flex flex-col justify-end pb-2 md:pb-0 z-20">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
