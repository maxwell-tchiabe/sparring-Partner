'use client';

import { cn } from '@/lib/utils';

interface ComingSoonBadgeProps {
  className?: string;
  text?: string;
  showDot?: boolean;
}

/**
 * A small pill badge used to flag unimplemented features.
 */
export function ComingSoonBadge({ className, text = 'SOON', showDot = false }: ComingSoonBadgeProps) {
  return (
    <span 
      className={cn(
        "ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 leading-none select-none shrink-0 gap-1",
        className
      )}
    >
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
      {text}
    </span>
  );
}
