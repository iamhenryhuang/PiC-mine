import ChatInterface from '@/components/chat/ChatInterface';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Cpu, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30 transition-colors duration-300 bg-grid-pattern">
      <div className="scanline"></div>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[80px] opacity-40 animate-pulse animate-float animate-morph" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[80px] opacity-40 animate-pulse delay-1000 animate-float animate-morph" style={{ animationDirection: 'reverse' }} />
        <div className="absolute top-[30%] left-[30%] w-[30%] h-[30%] bg-purple-500/20 rounded-full blur-[60px] opacity-30 animate-morph" />

        {/* Grid Runners */}
        <div className="grid-runner left-[10%]" style={{ animationDelay: '0s' }}></div>
        <div className="grid-runner left-[30%]" style={{ animationDelay: '2s' }}></div>
        <div className="grid-runner left-[50%]" style={{ animationDelay: '4s' }}></div>
        <div className="grid-runner left-[70%]" style={{ animationDelay: '1s' }}></div>
        <div className="grid-runner left-[90%]" style={{ animationDelay: '3s' }}></div>

        {/* Hex Data Stream */}
        <div className="absolute top-0 right-8 h-full w-8 hidden md:flex flex-col overflow-hidden opacity-20 text-[10px] text-primary font-mono select-none">
          <div className="hex-stream">
            0x4F 0xA1 0x2B 0x9C 0xD4 0xE8 0x1F 0x5A 0xB3 0x7E 0x05 0x89 0xC2 0x6D 0x30 0xF7 0x4F 0xA1 0x2B 0x9C 0xD4 0xE8 0x1F 0x5A 0xB3 0x7E 0x05 0x89 0xC2 0x6D 0x30 0xF7
          </div>
        </div>
        <div className="absolute top-0 left-8 h-full w-8 hidden md:flex flex-col overflow-hidden opacity-20 text-[10px] text-primary font-mono select-none">
          <div className="hex-stream" style={{ animationDirection: 'reverse' }}>
            0x3A 0xF2 0x8C 0x1D 0xE4 0x5B 0x90 0x7F 0x26 0xA5 0xD8 0x4E 0xB1 0x69 0x0C 0xF3 0x3A 0xF2 0x8C 0x1D 0xE4 0x5B 0x90 0x7F 0x26 0xA5 0xD8 0x4E 0xB1 0x69 0x0C 0xF3
          </div>
        </div>
      </div>

      {/* System HUD Overlay */}
      <div className="fixed inset-0 z-40 pointer-events-none p-4 md:p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="border-t-2 border-l-2 border-primary/50 w-8 h-8 md:w-16 md:h-16"></div>
          <div className="border-t-2 border-r-2 border-primary/50 w-8 h-8 md:w-16 md:h-16"></div>
        </div>
        <div className="flex justify-between items-end">
          <div className="border-b-2 border-l-2 border-primary/50 w-8 h-8 md:w-16 md:h-16 flex items-end p-1">
            <span className="text-[10px] text-primary/70 font-mono hidden md:block">SYS.VER.2.0.45</span>
          </div>
          <div className="border-b-2 border-r-2 border-primary/50 w-8 h-8 md:w-16 md:h-16 flex justify-end items-end p-1">
            <span className="text-[10px] text-primary/70 font-mono hidden md:block">ONLINE</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center gap-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground mb-4 backdrop-blur-sm tech-border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-mono">INITIALIZING_AI_CORE...</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            用 AI 打造你的 <span className="text-gradient glitch-text" data-text="夢想電腦">夢想電腦</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono">
            &gt; PiC mine IS YOUR INTELLIGENT PC COMPONENT SELECTOR.<br />
            &gt; INPUT YOUR REQUIREMENTS. SYSTEM WILL OPTIMIZE.
          </p>

          <div className="flex flex-wrap justify-center gap-8 pt-8 text-muted-foreground font-mono text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>[REAL-TIME_REC]</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>[COMPAT_CHECK]</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>[PERF_OPTIMIZE]</span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="w-full mt-8">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
