
import React from 'react';

interface AgentCodeBlockProps {
  code: string;
  title?: string;
  language?: string;
}

const AgentCodeBlock = ({ 
  code, 
  title, 
  language = 'json' 
}: AgentCodeBlockProps) => {
  return (
    <div className="rounded-md overflow-hidden">
      {title && (
        <div className="text-sm font-medium p-2 bg-slate-800 text-white border-b border-slate-700">
          {title}
        </div>
      )}
      <pre className={`p-3 rounded-md text-xs overflow-auto bg-slate-700 text-white ${!title ? 'rounded-t-md' : ''}`}>
        {code}
      </pre>
    </div>
  );
};

export default AgentCodeBlock;
