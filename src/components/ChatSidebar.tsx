
import { cn } from '@/lib/utils';
import ChatContainer from './chat/ChatContainer';
import { useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';

const ChatSidebar = () => {
  const { messages } = useChat();
  
  // Add debug log to check if ChatSidebar is mounting properly
  useEffect(() => {
    console.log('[ChatSidebar] Mounted with', messages.length, 'messages');
  }, [messages.length]);
  
  return (
    <div 
      className={cn(
        "h-[calc(100vh-64px)] flex flex-col fixed right-0",
        "animate-fade-in border-l border-border/40",
        "bg-sidebar/80 backdrop-blur-sm",
        "top-16 bottom-0 z-40"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 cursor-ew-resize group",
          "hover:bg-primary/20 active:bg-primary/40 transition-colors"
        )}
        data-resize-handle
      >
        <div className="opacity-0 group-hover:opacity-100 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full p-1.5 bg-primary/10 rounded">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-primary/50 rounded" />
            <div className="w-0.5 h-4 bg-primary/50 rounded" />
          </div>
        </div>
      </div>
      <ChatContainer />
    </div>
  );
};

export default ChatSidebar;
