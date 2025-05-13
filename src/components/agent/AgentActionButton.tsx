
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface AgentActionButtonProps {
  children: ReactNode;
  icon: LucideIcon;
  asChild?: boolean;
  onClick?: () => void;
}

const AgentActionButton = ({ 
  children, 
  icon: Icon, 
  asChild = false,
  onClick 
}: AgentActionButtonProps) => {
  const ButtonComponent = (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2" 
      onClick={onClick}
      asChild={asChild}
    >
      <Icon size={16} />
      {children}
    </Button>
  );

  return ButtonComponent;
};

export default AgentActionButton;
