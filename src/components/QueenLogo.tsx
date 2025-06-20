import React from 'react';
import { cn } from '@/lib/utils';

interface QueenLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'sidebar';
  showText?: boolean;
  className?: string;
}

const QueenLogo = ({ 
  size = 'md', 
  variant = 'default',
  showText = true,
  className 
}: QueenLogoProps) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6 text-xs';
      case 'lg': return 'w-10 h-10 text-lg';
      case 'md':
      default: return 'w-16 h-16 text-sm';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        getSizeClass(),
        'relative flex items-center justify-center'
      )}>
        <img 
          src="/newlogo.png" 
          alt="Queen Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={cn(
            "font-bold tracking-tight leading-none text-foreground",
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
          )}>
            Queen ALAYA
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground">AI Agent Network</span>
          )}
        </div>
      )}
    </div>
  );
};

export default QueenLogo; 