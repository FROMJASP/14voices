import { cn } from "@/lib/utils"

export interface AnimatedGradientTextProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradientText({
  children,
  className,
}: AnimatedGradientTextProps) {
  return (
    <div
      className={cn(
        "relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40",
        className
      )}
    >
      <div className="absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-primary/50 via-primary/50 to-primary/50 bg-[length:200%_100%] rounded-2xl opacity-30" />
      <div className="relative z-10 flex items-center space-x-2">
        {children}
      </div>
    </div>
  )
}