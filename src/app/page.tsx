import ChatInterface from '@/components/ChatInterface';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Cpu, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30 transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-50 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center gap-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground mb-4 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            AI 驅動的電腦組裝助手
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            用 AI 打造你的 <span className="text-gradient">夢想電腦</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            PiC mine 是您的智慧電腦零件挑選助理。
            只要告訴我們您的用途或遊戲需求，剩下的交給我們。
          </p>

          <div className="flex flex-wrap justify-center gap-8 pt-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>即時推薦</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span>相容性檢查</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              <span>效能最佳化</span>
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
