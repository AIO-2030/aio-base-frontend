
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  label: string;
  submittingLabel: string;
}

const FormSubmitButton = ({ isSubmitting, label, submittingLabel }: FormSubmitButtonProps) => {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? submittingLabel : label}
    </Button>
  );
};

export default FormSubmitButton;
