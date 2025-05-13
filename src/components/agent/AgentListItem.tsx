
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AgentListItemProps {
  name: string;
  description: string;
  icon?: ReactNode;
  actions?: ReactNode;
  to?: string;
  onClick?: () => void;
}

const AgentListItem = ({ 
  name, 
  description, 
  icon, 
  actions,
  to,
  onClick
}: AgentListItemProps) => {
  const content = (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {to && <ExternalLink size={16} className="text-muted-foreground" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  
  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }
  
  return content;
};

export default AgentListItem;
