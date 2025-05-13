
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Recursively renders a nested object as a hierarchical UI
 */
export const renderNestedObject = (obj: Record<string, any> | null | undefined, depth = 0): React.ReactNode => {
  if (!obj) return null;
  
  return (
    <div className={cn("pl-2", depth > 0 ? "border-l-2 border-gray-700" : "")}>
      {Object.entries(obj).map(([key, value], index) => {
        // Format the key nicely
        const formattedKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());
        
        // Handle different value types
        if (value === null || value === undefined) {
          return (
            <div key={index} className="py-1">
              <span className="font-medium text-purple-400">{formattedKey}:</span>{' '}
              <span className="italic opacity-70">Not specified</span>
            </div>
          );
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          return (
            <div key={index} className="py-1">
              <div className="font-medium text-purple-400">{formattedKey}:</div>
              <div className="pl-4 mt-1">
                {renderNestedObject(value, depth + 1)}
              </div>
            </div>
          );
        } else if (Array.isArray(value)) {
          return (
            <div key={index} className="py-1">
              <div className="font-medium text-purple-400">{formattedKey}:</div>
              <div className="pl-4 mt-1">
                {value.length === 0 ? (
                  <span className="italic opacity-70">Empty list</span>
                ) : (
                  <ul className="list-disc list-inside">
                    {value.map((item, i) => (
                      <li key={i} className="py-0.5">
                        {typeof item === 'object' 
                          ? renderNestedObject(item, depth + 1)
                          : String(item)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        } else {
          // Simple value (string, number, boolean)
          return (
            <div key={index} className="py-1">
              <span className="font-medium text-purple-400">{formattedKey}:</span>{' '}
              <span>{String(value)}</span>
            </div>
          );
        }
      })}
    </div>
  );
};
