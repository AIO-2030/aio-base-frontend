
import React from 'react';
import { Card } from "../../components/ui/card";

const Chapter6 = () => {
  return (
    <div className="chapter">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">Chapter 6: Roadmap & Ecosystem Comparison</h2>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">Milestone Plan | AIO-2030 Roadmap</h3>
          <p>
            The AIO Protocol represents an evolving framework with a clear development roadmap across multiple quarters.
            Each phase builds upon previous achievements to create a comprehensive, decentralized agent ecosystem.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6 shadow-md">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">Q1 | AIO-2030 Platform Foundation & Core Contract Implementation</h4>
            <p className="text-sm text-gray-500 mb-3">March 17, 2025 – June 14, 2025</p>
            
            <p className="mb-3 italic">
              "The first step in the AIO Protocol's rollout, focusing on building the foundational infrastructure for the agent autonomous network."
            </p>
            
            <div>
              <h5 className="font-medium mb-1">Targets & Products:</h5>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Complete EndPoint Canister Contract for agent registration and staking</li>
                <li>Build the Queen Agent Prototype for task parsing and trace_id chains</li>
                <li>Design the Arbiter Interface and task record model</li>
                <li>Launch AIO-2030 Dev Portal with documentation and testing interfaces</li>
                <li>Release AIO-2030 Whitepaper V1 detailing protocol specifications</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 shadow-md">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">Q2 | Full AIO Protocol Launch & Economic Model Kickoff</h4>
            <p className="text-sm text-gray-500 mb-3">June 15, 2025 – September 12, 2025</p>
            
            <p className="mb-3 italic">
              "Release the standardized AIO Protocol v1 and corresponding product implementation alongside the token economic model."
            </p>
            
            <div>
              <h5 className="font-medium mb-1">Targets & Products:</h5>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Launch AIO Protocol v1.0 with task types and trace_id tracking</li>
                <li>Complete $AIO Economic Model with staking rules and SNS mechanisms</li>
                <li>Implement Arbiter Canister v1 for incentive tracking</li>
                <li>Initiate AIO Genesis Grant program for developers</li>
                <li>Establish MCP/LLM Service Provider integration options</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 shadow-md">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">Q3 | Queen AI: Full Agent Ecosystem Launch</h4>
            <p className="text-sm text-gray-500 mb-3">September 13, 2025 – December 11, 2025</p>
            
            <p className="mb-3 italic">
              "Upgrade Queen Agent to serve as the central AI orchestrator, enabling automated agent onboarding and collaboration."
            </p>
            
            <div>
              <h5 className="font-medium mb-1">Targets & Products:</h5>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Release Queen Agent v2.0 with full orchestration capabilities</li>
                <li>Enable Agent Auto-Registration Interface via JSON-RPC</li>
                <li>Develop Capability Classification & Time-Tracking System</li>
                <li>Launch AIO Agent Integration Model and Container SDK</li>
                <li>Start AIO-DAO Governance Version 1 for community participation</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 shadow-md">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">Q4 | Ecosystem Expansion & Commercial Application Launch</h4>
            <p className="text-sm text-gray-500 mb-3">December 12, 2025 – March 2026</p>
            
            <p className="mb-3 italic">
              "Build a neutral community network and attract external AI platforms to integrate with the AIO ecosystem."
            </p>
            
            <div>
              <h5 className="font-medium mb-1">Targets & Products:</h5>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Open integrations with platforms like Doubao, Coze, POE, and others</li>
                <li>Release AIO Webhook SDK for rapid SaaS/Agent API registration</li>
                <li>Launch AIO Nebula Market System for agent search and collaboration</li>
                <li>Establish AIO Service Provider Generative Registry for quick onboarding</li>
                <li>Release complete AIO-DAO Governance Framework with voting models</li>
              </ul>
            </div>
          </Card>
        </div>
        
        {/* Visual Roadmap Image */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6">AIO-2030 Visual Roadmap</h3>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/f0249c98-36e0-4ca2-a922-2365c21b815c.png" 
              alt="AIO-2030 Roadmap visualization showing quarterly milestones from Q1 to Q4 2025" 
              className="max-w-full rounded-lg shadow-lg" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter6;
