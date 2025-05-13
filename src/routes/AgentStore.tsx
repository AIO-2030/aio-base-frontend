
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, PlusCircle, BookOpen, FileCode, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { caseStudies } from '@/components/agentStore/agentData';
import { getAgentItemsPagenize, getUserAgentItems } from '@/services/can/agentOperations';
import type { AgentItem } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';

// Interface for adapted agent data
interface AdaptedAgentItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  originalImage: string;
  image: string;
  hasVideo: boolean;
}

// Helper function to adapt backend agent items to frontend display format
const adaptAgentItem = (item: AgentItem): AdaptedAgentItem => {
  return {
    id: Number(item.id),
    title: item.name,
    subtitle: `by ${item.author}`,
    description: item.description,
    category: 'Agent',
    originalImage: item.image_url.length > 0 ? item.image_url[0] : '/placeholder-image.jpg',
    image: '/placeholder-image.jpg', // Default image until converted
    hasVideo: false, // Default to false unless we have data indicating video presence
  };
};

// Function to truncate text to a specific word count
const truncateToWords = (text: string, wordCount: number): string => {
  const words = text.split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(' ') + '...';
};

// Function to fetch an image and convert it to a data URL
const convertImageToDataUrl = async (imageUrl: string): Promise<string> => {
  try {
    // Check if it's already a data URL
    if (imageUrl.startsWith('data:')) return imageUrl;
    
    // Check if it's a local asset
    if (imageUrl.startsWith('/')) return imageUrl;
    
    console.log(`Converting image URL to data URL: ${imageUrl}`);
    
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to data URL:', error);
    return '/placeholder-image.jpg'; // Fallback to placeholder on error
  }
};

const AgentStore = () => {
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [agentItems, setAgentItems] = useState<AgentItem[]>([]);
  const [displayAgents, setDisplayAgents] = useState<AdaptedAgentItem[]>([]);
  const [totalAgents, setTotalAgents] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  
  // Get case study navigation functions
  const nextCaseStudy = () => {
    setActiveCaseStudy(current => (current + 1) % caseStudies.length);
  };
  const prevCaseStudy = () => {
    setActiveCaseStudy(current => (current - 1 + caseStudies.length) % caseStudies.length);
  };

  // Fetch total count of agents (only needed once)
  useEffect(() => {
    const fetchTotalAgents = async () => {
      try {
        const allAgents = await getUserAgentItems();
        setTotalAgents(allAgents.length);
      } catch (error) {
        console.error("Failed to fetch total agents:", error);
        setTotalAgents(0);
      }
    };
    
    fetchTotalAgents();
  }, []);

  // Fetch paginated agents whenever the page changes
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const fetchedAgents = await getAgentItemsPagenize(currentPage, itemsPerPage);
        setAgentItems(fetchedAgents);
        
        // Initialize display agents with placeholder images
        const adapted = fetchedAgents.map(adaptAgentItem);
        setDisplayAgents(adapted);
        
        // Convert image URLs to data URLs for each agent
        const agentsWithDataUrls = await Promise.all(
          adapted.map(async (agent) => {
            // Only convert if it's an external URL
            if (agent.originalImage && (agent.originalImage.startsWith('http://') || agent.originalImage.startsWith('https://'))) {
              const dataUrl = await convertImageToDataUrl(agent.originalImage);
              return { ...agent, image: dataUrl };
            }
            return { ...agent, image: agent.originalImage };
          })
        );
        
        setDisplayAgents(agentsWithDataUrls);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
        setAgentItems([]);
        setDisplayAgents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, [currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalAgents / itemsPerPage);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Data will be fetched automatically by the useEffect
  };

  return (
    <div className="py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Agent Mnemonic</h1>
          <p className="text-muted-foreground">Discover and deploy AIO protocol compatible agents</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="gap-2">
            <Link to="/home/agent-implementation">
              <BookOpen size={18} />
              Implementation Guide
            </Link>
          </Button>
          <Button variant="default" asChild className="gap-2">
            <Link to="/home/add-agent">
              <PlusCircle size={18} />
              Add My Agent
            </Link>
          </Button>
        </div>
      </div>

      {/* Case Study Card */}
      <div className="mb-12 border rounded-xl shadow-sm overflow-hidden bg-card">
        {/* Case study content remains unchanged */}
        <div className="p-8">
          <div className="text-center mb-2">
            <span className="text-sm text-muted-foreground uppercase tracking-wide">CASE STUDY</span>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">{caseStudies[activeCaseStudy].title}</h1>
          <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto">
            {caseStudies[activeCaseStudy].description}
          </p>
          <div className="flex justify-center mt-6">
            <button className="text-primary hover:underline">Read more</button>
          </div>
        </div>
        
        {/* Pagination controls */}
        <div className="flex justify-between items-center px-8 pb-4">
          <button className="p-2 rounded-full border hover:bg-secondary transition-colors" onClick={prevCaseStudy}>
            <ChevronLeft size={20} />
          </button>
          <button className="p-2 rounded-full border hover:bg-secondary transition-colors" onClick={nextCaseStudy}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-8">
          <p>Loading agents...</p>
        </div>
      )}

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayAgents.map(agent => (
          <Card key={agent.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48 bg-slate-200">
              <img src={agent.image} alt={agent.title} className="w-full h-full object-cover" />
              <Badge className="absolute top-3 left-3 bg-white/90 text-black">
                {agent.category}
              </Badge>
              {agent.hasVideo && (
                <button className="absolute right-3 top-3 bg-white/90 p-2 rounded-full hover:bg-white/70 transition-colors">
                  <Play size={16} />
                </button>
              )}
            </div>
            <CardContent className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-2">{agent.title}</h3>
              
              <p className="text-sm text-muted-foreground mb-2">
                {agent.subtitle}
              </p>
              
              <p className="text-sm text-muted-foreground mb-6 flex-grow">
                {truncateToWords(agent.description, 20)}
              </p>
              
              <div className="flex justify-between items-center pt-3 border-t mt-auto">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8" title="View Source Code">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FileCode size={16} />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8" title="Try Agent">
                    <Link to={`/home/agent/${agent.title}`}>
                      <ExternalLink size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Pagination with server-side page handling */}
      {totalPages > 0 && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} 
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} 
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    isActive={currentPage === index + 1} 
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} 
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AgentStore;
