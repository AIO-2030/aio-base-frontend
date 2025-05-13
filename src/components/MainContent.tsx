
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom';

interface MainContentProps {
  showChat?: boolean;
  className?: string;
}

const MainContent = ({ showChat, className }: MainContentProps) => {
  return (
    <main className={cn(
      "flex-1 overflow-y-auto pt-16 h-full web3-gradient-bg",
      className
    )}>
      <div className={cn(
        "container mx-auto p-6 page-transition",
        showChat ? 'max-w-full' : 'max-w-full'
      )}>
        <Outlet />
      </div>
    </main>
  );
};

export default MainContent;
