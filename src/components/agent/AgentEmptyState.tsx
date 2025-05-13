
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AgentEmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

const AgentEmptyState = ({
  title,
  description,
  icon,
  actionLabel = "Add Agent",
  actionLink = "/home/add-agent",
  onAction
}: AgentEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      
      {actionLink ? (
        <Button asChild>
          <Link to={actionLink} className="gap-2">
            <PlusCircle size={16} />
            {actionLabel}
          </Link>
        </Button>
      ) : onAction ? (
        <Button onClick={onAction} className="gap-2">
          <PlusCircle size={16} />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default AgentEmptyState;
