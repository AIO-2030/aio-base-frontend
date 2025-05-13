
import React, { ReactNode } from 'react';

interface AgentSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const AgentSection = ({ title, children, className = '' }: AgentSectionProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div>
        {children}
      </div>
    </div>
  );
};

export default AgentSection;
