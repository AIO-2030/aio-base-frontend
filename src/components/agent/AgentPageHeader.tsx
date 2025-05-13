
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentPageHeaderProps {
  title: string;
  backLink?: string;
  actions?: ReactNode;
}

const AgentPageHeader = ({ 
  title, 
  backLink = '/home/agent-store',
  actions 
}: AgentPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        {backLink && (
          <Link to={backLink} className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft size={18} />
            </Button>
          </Link>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default AgentPageHeader;
