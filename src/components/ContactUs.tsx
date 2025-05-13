
import React from 'react';
import { Link, Linkedin, Twitter, Facebook, Mail, LayoutDashboard, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactUs = () => {
  return (
    <div className="py-8 bg-card/30 rounded-lg border border-border/20 my-8">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Contact us</h2>
      
      <div className="flex flex-wrap gap-6 justify-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary border-0"
          asChild
        >
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" aria-label="Website">
            <Link size={20} />
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary border-0"
          asChild
        >
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={20} />
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary border-0"
          asChild
        >
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <Twitter size={20} />
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary border-0"
          asChild
        >
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook size={20} />
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary border-0"
          asChild
        >
          <a href="mailto:contact@example.com" aria-label="Email">
            <Mail size={20} />
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary border-0"
          asChild
        >
          <a href="https://dashboard.example.com" target="_blank" rel="noopener noreferrer" aria-label="Dashboard">
            <LayoutDashboard size={20} />
          </a>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary border-0"
          asChild
        >
          <a href="https://t.me/example" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <Send size={20} />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ContactUs;
