
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getAgentItemByName } from '@/services/can/agentOperations';
import type { AgentItem } from 'declarations/aio-base-backend/aio-base-backend.did.d.ts';
import AgentInfoCard from '@/components/agent/AgentInfoCard';
import AgentTestSection from '@/components/agent/AgentTestSection';
import AgentDocumentationSection from '@/components/agent/AgentDocumentationSection';
import AgentPageHeader from '@/components/agent/AgentPageHeader';

const AgentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [agent, setAgent] = useState<AgentItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch agent details
  useEffect(() => {
    const fetchAgentDetails = async () => {
      setLoading(true);
      try {
        console.log('[Agentdetail]Agent ID:', id);
        if (id) {
          const agentData = await getAgentItemByName(id);
          console.log('[AgentDetail] Agent data received:', agentData);
          setAgent(agentData || null);
        }
      } catch (error) {
        console.error('Error fetching agent details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch agent details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgentDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="py-8 flex justify-center items-center">
        <p>Loading agent details...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="py-8">
        <AgentPageHeader title="Agent not found" />
        <Card>
          <CardContent className="py-8">
            <p>The agent "{id}" could not be found.</p>
            <div className="mt-4">
              <Link to="/home/agent-store">
                <Button>Return to Agent Store</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <AgentPageHeader title={agent.name} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-1">
          <AgentInfoCard agent={agent} />
        </div>
        
        <div className="lg:col-span-2">
          <AgentTestSection agent={agent} />
        </div>
      </div>
      
      <AgentDocumentationSection agent={agent} />
    </div>
  );
};

export default AgentDetails;
