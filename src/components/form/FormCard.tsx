
import React, { ReactNode } from 'react';

interface FormCardProps {
  children: ReactNode;
}

const FormCard = ({ children }: FormCardProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      {children}
    </div>
  );
};

export default FormCard;
