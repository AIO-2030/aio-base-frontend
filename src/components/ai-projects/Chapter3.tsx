
import React from 'react';
import { Card } from "../../components/ui/card";

const Chapter3 = () => {
  return (
    <div className="chapter">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">AIO Protocol Stack</h2>
      
      <div className="space-y-10">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">Modular Architecture for Agentic AI Collaboration</h3>
          <p className="text-lg">
            The <strong>AIO Protocol</strong> is a multi-layered framework designed to standardize how agentic AI services interact, execute, and coordinate within a decentralized, composable AI ecosystem. Each layer plays a distinct role in transforming high-level user intent into verified, tokenized computational output.
          </p>
          
          <div className="flex justify-center my-8">
            <figure className="text-center">
              <img 
                src="/lovable-uploads/031fac65-df5c-4481-b008-3f573a5053bf.png" 
                alt="AIO Protocol Stack Architecture" 
                className="max-w-full rounded-lg border border-gray-200 shadow-lg"
              />
              <figcaption className="text-sm text-gray-500 mt-2">Figure 3.1: AIO Protocol Stack Architecture</figcaption>
            </figure>
          </div>
        </div>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-primary/20">
          <h3 className="text-xl font-semibold mb-4 text-primary">1. Application Layer <span className="text-gray-400 font-normal">(Intent & Interaction Interface)</span></h3>
          
          <p className="mb-4">
            This layer captures <strong>user goals</strong>, system-level prompts, or inter-agent requests, and structures them into actionable tasks.
          </p>
          
          <div className="ml-4 mb-4">
            <h4 className="font-medium text-lg mb-2">Components:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code className="bg-background/80 px-1 rounded">Task Type</code> – Defines goal semantics (e.g., generate, translate, verify).</li>
              <li><code className="bg-background/80 px-1 rounded">Prompts / Input</code> – Structured input: user instructions or upstream output.</li>
              <li><code className="bg-background/80 px-1 rounded">Target Agent</code> – Specifies destination (e.g., <code>chat.agent</code>, <code>vision.agent</code>).</li>
              <li><code className="bg-background/80 px-1 rounded">Output Format</code> – Expected result type (text, image, audio, JSON).</li>
            </ul>
          </div>
          
          <p><strong>Interface Example:</strong> <code className="bg-primary/10 px-2 py-1 rounded text-primary">aio.input</code></p>
          <p className="mt-2">Serves as the <strong>semantic entry point</strong> to the entire AIO execution pipeline.</p>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-primary/20">
          <h3 className="text-xl font-semibold mb-4 text-primary">2. Protocol Layer <span className="text-gray-400 font-normal">(Inter-Agent Communication Format)</span></h3>
          
          <p className="mb-4">
            AIO agents communicate using an extended <strong>JSON-RPC 2.0</strong> standard.
          </p>
          
          <div className="ml-4 mb-4">
            <h4 className="font-medium text-lg mb-2">Base Fields:</h4>
            <p><code className="bg-background/80 px-1 rounded">method</code>, <code className="bg-background/80 px-1 rounded">params</code>, <code className="bg-background/80 px-1 rounded">id</code>, <code className="bg-background/80 px-1 rounded">result</code>, <code className="bg-background/80 px-1 rounded">error</code></p>
            
            <h4 className="font-medium text-lg mt-4 mb-2">Extended Fields:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code className="bg-background/80 px-1 rounded">trace_id</code> – Links multi-agent call chains for observability.</li>
              <li><code className="bg-background/80 px-1 rounded">namespace.method</code> – Scoped method names (e.g., <code>vision.detect</code>).</li>
            </ul>
          </div>
          
          <p className="mt-2">Guarantees consistency, <strong>cross-agent interoperability</strong>, and full <strong>call traceability</strong>.</p>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-primary/20">
          <h3 className="text-xl font-semibold mb-4 text-primary">3. Transport Layer <span className="text-gray-400 font-normal">(Message Transmission Protocols)</span></h3>
          
          <p className="mb-4">
            Defines <strong>how messages are routed</strong> between agents, executors, and orchestrators.
          </p>
          
          <div className="ml-4 mb-4">
            <h4 className="font-medium text-lg mb-2">Supported Channels:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code className="bg-background/80 px-1 rounded">stdio</code> – For local CLI-style agents or embedded systems.</li>
              <li><code className="bg-background/80 px-1 rounded">HTTP</code> – Default channel for REST-based invocation.</li>
              <li><code className="bg-background/80 px-1 rounded">SSE</code> – Server-Sent Events for <strong>real-time streaming</strong> tasks.</li>
            </ul>
          </div>
          
          <p className="mt-2">Ensures flexible communication across <strong>diverse runtime environments</strong>.</p>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-primary/20">
          <h3 className="text-xl font-semibold mb-4 text-primary">4. Execution Layer <span className="text-gray-400 font-normal">(Runtime Abstraction for AI Agents)</span></h3>
          
          <p className="mb-4">
            Abstracts where and how agents run within the AIO network.
          </p>
          
          <div className="ml-4 mb-4">
            <h4 className="font-medium text-lg mb-2">Supported Runtimes:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code className="bg-background/80 px-1 rounded">AIO_POD</code> – Default for dynamic, isolated tasks.</li>
              <li><code className="bg-background/80 px-1 rounded">Wasm Modules</code> – For ICP Canister or edge-based execution.</li>
              <li><code className="bg-background/80 px-1 rounded">Hosted APIs</code> – For integrating third-party AI (e.g., Doubao, Eliza).</li>
            </ul>
            <h4 className="font-medium text-lg mt-4 mb-2">Managed by:</h4>
            <p><code className="bg-primary/10 px-2 py-1 rounded text-primary">Queen Agent</code></p>
          </div>
          
          <p className="mt-2">Enables <strong>trust-agnostic agent deployment</strong>, coordinated via AIO context.</p>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-primary/20">
          <h3 className="text-xl font-semibold mb-4 text-primary">5. Coordination Layer (Meta-AIO) <span className="text-gray-400 font-normal">(Orchestration & Trust Coordination)</span></h3>
          
          <p className="mb-4">
            Drives <strong>multi-agent scheduling</strong>, invocation routing, and capability selection.
          </p>
          
          <div className="ml-4 mb-4">
            <h4 className="font-medium text-lg mb-2">Key Modules:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code className="bg-background/80 px-1 rounded">Queen Agent</code> – Constructs execution chains & resolves intent.</li>
              <li><code className="bg-background/80 px-1 rounded">EndPoint Canister</code> – Smart contracts storing agent metadata, stake, and capability.</li>
              <li><code className="bg-background/80 px-1 rounded">Arbiter Canister</code> – Validates work records, ensures reward eligibility.</li>
            </ul>
          </div>
          
          <p className="mt-2">Provides <strong>autonomous orchestration</strong> with <strong>on-chain verifiability</strong>.</p>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-primary/20">
          <h3 className="text-xl font-semibold mb-4 text-primary">6. Ledger Layer <span className="text-gray-400 font-normal">(On-Chain Execution & Incentive Settlement)</span></h3>
          
          <p className="mb-4">
            Implements a <strong>distributed ledger</strong> via ICP Canisters for computation proof and token rewards.
          </p>
          
          <div className="ml-4 mb-4">
            <h4 className="font-medium text-lg mb-2">Responsibilities:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Logs execution history, quality scores, and staking events.</li>
              <li>Distributes <strong>$AIO token rewards</strong> based on validated workload.</li>
              <li>Supports future <strong>cross-chain interoperability</strong>.</li>
            </ul>
          </div>
          
          <p className="mt-2">Ensures <strong>transparent, immutable, and tokenized accountability</strong> for all AIO activities.</p>
        </Card>
      </div>
    </div>
  );
};

export default Chapter3;
