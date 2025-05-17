
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Terminal, TrashIcon } from 'lucide-react';
import { Button } from '../ui/button';
import ChatFileUploader, { AttachedFile } from './ChatFileUploader';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onStartRecording: () => void;
  isMicSupported: boolean;
  attachedFiles: AttachedFile[];
  onFileAttached: (fileId: string, fileInfo: AttachedFile) => void;
  onFileRemoved: (fileId: string) => void;
  onClearHistory?: () => void;
}

// Available commands for autocomplete
const COMMANDS = [
  { name: '/run', description: 'Run the protocol' },
  { name: '/stop', description: 'Stop the current execution' }
];

const ChatInput = ({ 
  message, 
  setMessage, 
  onSendMessage, 
  onStartRecording, 
  isMicSupported,
  attachedFiles,
  onFileAttached,
  onFileRemoved,
  onClearHistory
}: ChatInputProps) => {
  const [showCommands, setShowCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(COMMANDS);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commandsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Filter commands based on current input
    if (message.startsWith('/')) {
      const filtered = COMMANDS.filter(cmd => 
        cmd.name.toLowerCase().startsWith(message.toLowerCase())
      );
      setFilteredCommands(filtered);
      setShowCommands(filtered.length > 0);
      setSelectedCommandIndex(0);
    } else {
      setShowCommands(false);
    }
  }, [message]);
  
  // Handle outside click to close commands popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandsRef.current && !commandsRef.current.contains(event.target as Node)) {
        setShowCommands(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Command selection with arrow keys
    if (showCommands) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex(prev => prev > 0 ? prev - 1 : 0);
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          setMessage(filteredCommands[selectedCommandIndex].name);
          setShowCommands(false);
        }
        
        // If Enter and the command is complete, send it
        if (e.key === 'Enter' && filteredCommands.length > 0 && 
            message === filteredCommands[selectedCommandIndex].name) {
          onSendMessage();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowCommands(false);
      }
      return;
    }
    
    // Regular Enter handling when commands aren't shown
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
    
    // Show commands when typing '/'
    if (e.key === '/' && message === '') {
      setShowCommands(true);
    }
  };
  
  const selectCommand = (commandName: string) => {
    setMessage(commandName);
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  const handleClearHistory = () => {
    if (onClearHistory) {
      onClearHistory();
    }
  };
  
  return (
    <div className="p-3 border-t border-border/40 bg-background/80 w-full">
      <div className="flex flex-col space-y-2 relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Type / for commands)"
            className={`w-full min-h-[40px] max-h-[80px] p-2 rounded-md border border-border bg-background resize-none focus:outline-none focus:ring-1 ${
              message.startsWith('/') ? 'focus:ring-blue-500 border-blue-300 pl-[4.5rem]' : 'focus:ring-primary'
            }`}
          />
          {message.startsWith('/') && (
            <div className="absolute left-2 top-2 px-1.5 py-0.5 rounded text-xs font-mono bg-blue-500/10 text-blue-500 border border-blue-300/50">
              command
            </div>
          )}
        </div>
        
        {/* Command autocomplete popup */}
        {showCommands && (
          <div 
            ref={commandsRef}
            className="absolute bottom-full left-0 mb-2 w-64 bg-popover border border-border rounded-md shadow-lg py-1 z-10"
          >
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-border flex justify-between items-center">
              <span>Available Commands</span>
              <div className="flex gap-1 text-[10px]">
                <kbd className="px-1 bg-muted rounded">↑↓</kbd>
                <span>to navigate</span>
                <kbd className="px-1 bg-muted rounded">Tab</kbd>
                <span>to select</span>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredCommands.map((command, index) => (
                <div
                  key={command.name}
                  className={`px-3 py-2 cursor-pointer flex items-start gap-2 hover:bg-accent/50 ${
                    index === selectedCommandIndex ? 'bg-accent text-accent-foreground' : ''
                  }`}
                  onClick={() => selectCommand(command.name)}
                >
                  <Terminal size={14} className="mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{command.name}</div>
                    <div className="text-xs text-muted-foreground">{command.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChatFileUploader 
              onFileAttached={onFileAttached}
              onFileRemoved={onFileRemoved}
              attachedFiles={attachedFiles}
            />
            
            {isMicSupported && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onStartRecording}
                className="h-8 w-8 rounded-full"
              >
                <Mic size={16} className="text-muted-foreground" />
              </Button>
            )}
            
            {/* Clear History Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearHistory}
              className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100/20"
              title="Clear history"
            >
              <TrashIcon size={16} />
            </Button>
          </div>
          
          <Button
            onClick={onSendMessage}
            disabled={message.trim() === '' && attachedFiles.length === 0}
            size="sm"
            className="px-3 py-1"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
