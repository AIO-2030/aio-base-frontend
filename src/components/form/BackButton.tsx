
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to: string;
}

const BackButton = ({ to }: BackButtonProps) => {
  return (
    <Link to={to} className="mr-4">
      <Button variant="outline" size="icon">
        <ArrowLeft size={18} />
      </Button>
    </Link>
  );
};

export default BackButton;
