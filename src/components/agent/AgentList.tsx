
import React, { ReactNode } from 'react';

interface AgentListProps {
  children: ReactNode;
  className?: string;
}

const AgentList = ({ children, className = '' }: AgentListProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};

export default AgentList;
