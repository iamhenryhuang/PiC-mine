"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="group relative p-2 md:px-4 md:py-2 rounded-sm border border-primary/30 bg-black/40 hover:bg-primary/20 transition-all overflow-hidden flex items-center gap-3"
            aria-label="Toggle theme"
        >
            {/* Tech decoration corners */}
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-primary/50 group-hover:border-neon-cyan transition-colors" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-primary/50 group-hover:border-neon-cyan transition-colors" />

            <div className="relative w-4 h-4">
                <Sun className="absolute inset-0 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                <Moon className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-cyan-400" />
            </div>

            <span className="hidden md:block text-[10px] font-mono font-bold tracking-widest text-muted-foreground group-hover:text-primary uppercase">
                {mounted ? (theme === 'dark' ? 'Night_Ops' : 'Day_Ops') : 'Loading...'}
            </span>
        </button>
    )
}
