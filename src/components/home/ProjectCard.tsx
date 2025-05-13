
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: string;
  linkText: string;
  path: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col bg-card shadow-md hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="h-64 relative overflow-hidden">
        <img 
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-primary/90 text-white text-sm font-medium px-3 py-1 rounded-full">
          {project.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow bg-background">
        <h3 className="text-2xl font-bold leading-tight mb-3">
          {project.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-2">
          {project.subtitle}
        </p>
        
        <p className="text-sm text-muted-foreground mb-6 flex-grow">
          {project.description}
        </p>
        
        <Link 
          to={project.path}
          className="text-sm text-primary flex items-center gap-1 hover:underline mt-auto"
        >
          <span>{project.linkText}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
