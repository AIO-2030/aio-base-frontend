
import React, { ReactNode } from 'react';

interface AgentPropertyProps {
  label: string;
  children: ReactNode;
  className?: string;
}

const AgentProperty = ({ label, children, className = '' }: AgentPropertyProps) => {
  return (
    <div className={`${className}`}>
      <h3 className="text-sm font-medium mb-1">{label}</h3>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
};

export default AgentProperty;
