
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import Chapter1 from '../components/ai-projects/Chapter1';
import Chapter2 from '../components/ai-projects/Chapter2';
import Chapter3 from '../components/ai-projects/Chapter3';
import Chapter4 from '../components/ai-projects/Chapter4';
import Chapter5 from '../components/ai-projects/Chapter5';
import Chapter6 from '../components/ai-projects/Chapter6';

const AIProjects = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">AIO-2030: Redefining the Paradigm of Agentic AI</h1>
      
      <div className="mb-8">
        <p className="text-lg">
          A comprehensive analysis of the AIO Protocol for Web3 AIOps systems, 
          exploring its architecture, economics, and future research directions.
        </p>
      </div>

      <Tabs defaultValue="chapter1" className="w-full">
        {/* Enhanced TabsList for better visibility and responsiveness */}
        <div className="bg-black/5 dark:bg-white/5 p-2 rounded-lg mb-8 overflow-x-auto">
          <TabsList className="w-full flex flex-nowrap min-w-max md:grid md:grid-cols-6">
            <TabsTrigger 
              value="chapter1" 
              className="whitespace-nowrap flex-shrink-0 md:text-sm font-medium px-4 py-2 min-w-[180px] md:min-w-0"
            >
              Introducing Protocol Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="chapter2" 
              className="whitespace-nowrap flex-shrink-0 md:text-sm font-medium px-4 py-2 min-w-[180px] md:min-w-0"
            >
              Architecture & Implementation
            </TabsTrigger>
            <TabsTrigger 
              value="chapter3" 
              className="whitespace-nowrap flex-shrink-0 md:text-sm font-medium px-4 py-2 min-w-[180px] md:min-w-0"
            >
              AIO Protocol Stack
            </TabsTrigger>
            <TabsTrigger 
              value="chapter4" 
              className="whitespace-nowrap flex-shrink-0 md:text-sm font-medium px-4 py-2 min-w-[180px] md:min-w-0"
            >
              Protocol Economics
            </TabsTrigger>
            <TabsTrigger 
              value="chapter5" 
              className="whitespace-nowrap flex-shrink-0 md:text-sm font-medium px-4 py-2 min-w-[180px] md:min-w-0"
            >
              Ecosystem Capability Snapshot
            </TabsTrigger>
            <TabsTrigger 
              value="chapter6" 
              className="whitespace-nowrap flex-shrink-0 md:text-sm font-medium px-4 py-2 min-w-[180px] md:min-w-0"
            >
              Future Research Directions
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Tab content */}
        <div className="bg-white/5 rounded-lg p-6">
          <TabsContent value="chapter1" className="mt-0">
            <Chapter1 />
          </TabsContent>
          
          <TabsContent value="chapter2" className="mt-0">
            <Chapter2 />
          </TabsContent>
          
          <TabsContent value="chapter3" className="mt-0">
            <Chapter3 />
          </TabsContent>
          
          <TabsContent value="chapter4" className="mt-0">
            <Chapter4 />
          </TabsContent>
          
          <TabsContent value="chapter5" className="mt-0">
            <Chapter5 />
          </TabsContent>
          
          <TabsContent value="chapter6" className="mt-0">
            <Chapter6 />
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          © 2025 AIO Protocol Foundation. All research materials are provided under 
          Creative Commons Attribution 4.0 International License.
        </p>
      </div>
    </div>
  );
};

export default AIProjects;
