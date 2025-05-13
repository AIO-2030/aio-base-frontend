
import React from 'react';
import { Card } from "../../components/ui/card";

const Chapter2 = () => {
  return (
    <div className="chapter">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">Chapter 2: Architecture & Implementation</h2>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">AIO Protocol Stack</h3>
          <p>
            The AIO Protocol architecture is designed to support scalable agent networks with intelligent coordination capabilities.
            It defines a unified interface and execution framework for agentic AI capabilities, enabling seamless integration
            across heterogeneous AI Agents and intelligent services.
          </p>
          
          <div className="my-8 space-y-5">
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-blue-300">Unified Agentic AI Interface</h4>
              <p className="text-white">A standardized protocol for capability registration, invocation, and result formatting across all agent types.</p>
            </div>
            
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-blue-300">Multimodal Task Compatibility</h4>
              <p className="text-white">Native support for chat, voice, vision, and code-driven agents, enabling flexible expression of user intents across diverse input/output modalities.</p>
            </div>
            
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-blue-300">Versatile MCP Server Hosting</h4>
              <p className="text-white">AIO-MCP Servers can be hosted in a variety of environments, including AIO-Pod containers, HTTP endpoints, Server-Sent Events (SSE) streams, and Wasm-based execution modules.</p>
            </div>
            
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-blue-300">End-to-End AI Orchestration</h4>
              <p className="text-white">Supports intent recognition, task decomposition, MCP Server discovery, and the real-time construction of generative Think Context Chains for chain-of-thought execution.</p>
            </div>
            
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-blue-300">Full Traceability & Auditing</h4>
              <p className="text-white">Each task execution is captured via a comprehensive trace log, recording the entire reasoning chain and MCP Agent participation—enabling transparency and verifiability.</p>
            </div>
            
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-blue-300">Tokenized Incentive Infrastructure</h4>
              <p className="text-white">Integrated with on-chain smart contracts, the AIO Protocol features a transparent and open token incentive model, ensuring fair compensation for developers, operators, and data contributors.</p>
            </div>
          </div>
          
          <div className="my-10 flex justify-center">
            <figure className="text-center">
              <img 
                src="/lovable-uploads/7abced6a-dff2-456a-9e9c-4a2a113d989c.png" 
                alt="AIO Protocol Architecture Diagram" 
                className="max-w-full rounded-lg border border-gray-300 shadow-lg"
              />
              <figcaption className="mt-3 text-sm text-gray-600">Figure 2.1: AIO Protocol Stack Architecture</figcaption>
            </figure>
          </div>
        </div>

        <Card className="p-6 shadow-md bg-slate-800 text-white border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-blue-300">Modular Architecture Layers</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-200">1. Application Layer (Intent & Interaction Interface)</h4>
              <p>Captures user goals, system-level prompts, or inter-agent requests, and structures them into actionable tasks.</p>
              <ul className="list-disc pl-5 mt-1 text-sm text-gray-300">
                <li>Task Type – Defines goal semantics (e.g., generate, translate, verify)</li>
                <li>Prompts/Input – Structured input: user instructions or upstream output</li>
                <li>Target Agent – Specifies destination (e.g., chat.agent, vision.agent)</li>
                <li>Output Format – Expected result type (text, image, audio, JSON)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-200">2. Protocol Layer (Inter-Agent Communication Format)</h4>
              <p>AIO agents communicate using an extended JSON-RPC 2.0 standard.</p>
              <ul className="list-disc pl-5 mt-1 text-sm text-gray-300">
                <li>Base Fields: method, params, id, result, error</li>
                <li>Extended Fields: trace_id for multi-agent call chains, namespace.method for scoped method names</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-200">3. Transport Layer (Message Transmission Protocols)</h4>
              <p>Defines how messages are routed between agents, executors, and orchestrators.</p>
              <ul className="list-disc pl-5 mt-1 text-sm text-gray-300">
                <li>Supported Channels: stdio, HTTP, SSE (Server-Sent Events)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-200">4. Execution Layer (Runtime Abstraction for AI Agents)</h4>
              <p>Abstracts where and how agents run within the AIO network.</p>
              <ul className="list-disc pl-5 mt-1 text-sm text-gray-300">
                <li>AIO_POD – Default for dynamic, isolated tasks</li>
                <li>Wasm Modules – For ICP Canister or edge-based execution</li>
                <li>Hosted APIs – For integrating third-party AI</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-200">5. Coordination Layer (Meta-AIO)</h4>
              <p>Drives multi-agent scheduling, invocation routing, and capability selection.</p>
              <ul className="list-disc pl-5 mt-1 text-sm text-gray-300">
                <li>Queen Agent – Constructs execution chains & resolves intent</li>
                <li>EndPoint Canister – Smart contracts storing agent metadata</li>
                <li>Arbiter Canister – Validates work records, ensures reward eligibility</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-200">6. Ledger Layer (On-Chain Execution & Incentive Settlement)</h4>
              <p>Implements a distributed ledger via ICP Canisters for computation proof and token rewards.</p>
              <ul className="list-disc pl-5 mt-1 text-sm text-gray-300">
                <li>Logs execution history, quality scores, and staking events</li>
                <li>Distributes $AIO token rewards based on validated workload</li>
                <li>Supports future cross-chain interoperability</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Smart contract registration system section */}
        <Card className="p-6 shadow-md bg-[#1A1F2C] text-white border border-[#2D3748]">
          <h3 className="text-2xl font-semibold mb-4 text-[#9b87f5]">Smart Contract Registration System</h3>
          <p className="mb-4">
            AIO-2030 introduces a contract-based registration mechanism to onboard and verify decentralized intelligence 
            providers (MCP Servers) into the AIO Network. Each participant is encapsulated in a NFT-like smart contract instance, 
            ensuring transparency, traceability, and incentive alignment.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">NFT-Like MCP Registration Contracts</h4>
              <p className="text-gray-200">
                Each AIO-MCP Server is registered via a unique smart contract, functioning similarly to an NFT with rich 
                metadata and lifecycle management.
              </p>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">Standardized Metadata Schema</h4>
              <p className="text-gray-200">Each registration contract contains essential metadata, including:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Capability Declarations</li>
                <li>Personality Descriptions</li>
                <li>Staked Token Amounts</li>
                <li>Incentive Receiving Address</li>
                <li>Service Quality Score (SQS) based on historical performance metrics</li>
              </ul>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">Capability Declaration via Help Protocol</h4>
              <p className="text-gray-200">
                MCP Servers must implement the AIO-MCP-help protocol to declare their capabilities in a machine-readable format, 
                enabling Queen Agent to verify functionality and context.
              </p>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">On-Chain Verification & Submission</h4>
              <p className="text-gray-200">
                The Queen Agent evaluates the response from the help protocol and, upon successful verification, submits 
                the MCP registration contract to the blockchain for inclusion in the network.
              </p>
            </div>
          </div>
          
          <div className="bg-[#252B3B] p-5 rounded-lg">
            <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">Decentralized Indexing for Intelligent Discovery</h4>
            <p className="text-gray-200">
              Using both developer-declared metadata and verified help protocol results, the Queen Agent performs reasoning to 
              generate a keyword–group–mcp–mcpMethod inverted index, which is then submitted and stored on-chain via an 
              ICP Canister for high-performance discovery and scheduling.
            </p>
          </div>
          
          <div className="flex justify-between mt-8">
            <div className="flex-1 border-r border-gray-700 pr-6">
              <h5 className="font-semibold text-[#1EAEDB] mb-3">MCP Server Template Selection</h5>
              <p className="text-gray-300 mb-3">Select from pre-configured templates for different MCP module types:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-opacity-20 bg-blue-900 p-3 rounded border border-blue-700">
                  <h6 className="text-[#33C3F0] font-medium">Math Tools Server</h6>
                  <p className="text-sm text-gray-400">Provides mathematical utility functions</p>
                  <span className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded mt-2">Tools</span>
                </div>
                <div className="bg-opacity-20 bg-purple-900 p-3 rounded border border-purple-700">
                  <h6 className="text-[#D6BCFA] font-medium">LLM Sampling Server</h6>
                  <p className="text-sm text-gray-400">Handles text generation capabilities</p>
                  <div className="flex gap-1 mt-2">
                    <span className="inline-block bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">Prompts</span>
                    <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded">Sampling</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 pl-6">
              <h5 className="font-semibold text-[#1EAEDB] mb-3">Protocol Configuration</h5>
              <p className="text-gray-300 mb-3">MCP servers implement the AIO-MCP protocol with modular capabilities:</p>
              <div className="bg-[#181C27] p-3 rounded border border-gray-700 text-sm font-mono">
                <div className="text-gray-300">
                  <span className="text-blue-400">"type":</span> <span className="text-green-400">"mcp"</span>,
                </div>
                <div className="text-gray-300">
                  <span className="text-blue-400">"methods":</span> [<span className="text-green-400">"tools.list"</span>, <span className="text-green-400">"tools.call"</span>],
                </div>
                <div className="text-gray-300">
                  <span className="text-blue-400">"modalities":</span> [<span className="text-green-400">"text"</span>]
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* New Queen Agent Platform section */}
        <Card className="p-6 shadow-md bg-[#1A1F2C] text-white border border-[#2D3748]">
          <h3 className="text-2xl font-semibold mb-4 text-[#9b87f5]">Queen Agent Platform</h3>
          <p className="mb-4">
            The Queen Agent is the central orchestrator within the AIO-2030 architecture, functioning as a superintelligent
            coordination layer that binds user intent with distributed AI capabilities. It encapsulates cognition, reasoning, 
            discovery, execution, and incentive coordination. The Queen Agent transforms task requests into structured 
            execution workflows by leveraging both symbolic and generative reasoning.
          </p>
          
          <div className="grid gap-6 my-6">
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">3.1 Entry Point for AIO Protocol Tasks</h4>
              <p className="text-gray-200 mb-2">
                The Queen Agent serves as the primary ingress point for all tasks submitted via the AIO Protocol. 
                Each task is wrapped in a structured request that includes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>User intent and contextual metadata</li>
                <li>Input modalities (e.g., text, voice, vision)</li>
                <li>Execution constraints and performance expectations</li>
              </ul>
              <p className="text-gray-200 mt-2">
                Upon receiving a task, the Queen Agent instantiates an AIO-Context Instance—a dynamic, 
                session-scoped context that drives intent resolution and downstream agent coordination.
              </p>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">3.2 Cognitive Scheduling & Chain Construction</h4>
              <p className="text-gray-200 mb-2">Queen Agent constructs dynamic invocation chains by:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Parsing and interpreting user intent through Think Context Chains</li>
                <li>Discovering relevant AIO-MCP Servers and AI Agents via on-chain keyword-group–MCP–method inverted indexes</li>
                <li>Evaluating candidate agents based on declared capabilities, historical service quality, stake weight, and recent workload</li>
                <li>Assembling agents into an execution graph (linear or DAG), optimized for performance, cost-efficiency, and capability match</li>
              </ul>
              <p className="text-gray-200 mt-2">
                These invocation chains serve as the reasoning scaffolding for multi-agent execution, 
                enabling modular composition of AI services in real time.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center my-6">
            <figure className="text-center">
              <img 
                src="/lovable-uploads/0d36187e-ae24-42f7-99fc-d306f8acd643.png" 
                alt="Queen Agent Execution Plan" 
                className="max-w-full rounded-lg border border-gray-600 shadow-lg"
              />
              <figcaption className="mt-2 text-sm text-gray-400">Figure 2.3: Queen Agent Execution Plan Interface</figcaption>
            </figure>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">3.3 Multi-Agent Lifecycle Management</h4>
              <p className="text-gray-200 mb-2">
                The Queen Agent supervises the entire lifecycle of each multi-agent task, including:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Task decomposition into atomic subtasks</li>
                <li>Prompt schema resolution and input transformation</li>
                <li>Capability dispatch to selected agents or tools</li>
                <li>Result aggregation, feedback loops, and intermediate reasoning</li>
                <li>Output packaging for downstream consumption</li>
              </ul>
              <p className="text-gray-200 mt-2">
                Execution metadata—including task step logs, latencies, failure traces, and outputs—is captured 
                in a traceable task record and linked to the original trace_id and session_id.
              </p>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">3.4 Workload Reporting & Token Metering</h4>
              <p className="text-gray-200 mb-2">
                Upon task completion, the Queen Agent compiles a workload report containing:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Invocation chain topology</li>
                <li>Participation records of each agent</li>
                <li>Execution time, success metrics, and quality ratings</li>
              </ul>
              <p className="text-gray-200 mt-2">
                This report is submitted to the Arbiter, a ICP Canister-based system responsible for:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Verifying the validity and completeness of the execution</li>
                <li>Token metering based on participation, quality, and stake</li>
                <li>Distributing $AIO incentives to eligible developers and operators</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-[#252B3B] p-5 rounded-lg">
            <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">3.5 Session Awareness & Conversational Memory</h4>
            <p className="text-gray-200 mb-2">Each user task is bound to an AIO Session, enabling:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
              <li>Multi-turn context awareness</li>
              <li>Long-range memory linking prior invocations and responses</li>
              <li>Personalization of agent selection based on prior interaction history</li>
            </ul>
            <p className="text-gray-200 mt-2">
              This enables conversational agentic AI, where the Queen Agent can evolve its reasoning pathways 
              and agent selection heuristics over time, creating persistent and intelligent user experiences.
            </p>
          </div>
          
          <div className="flex justify-center mt-6 mb-4">
            <figure className="text-center">
              <img 
                src="/lovable-uploads/0f74ab47-36da-47d9-bc01-cba0869a1b15.png" 
                alt="Queen Agent Conversation Interface" 
                className="max-w-full rounded-lg border border-gray-600 shadow-lg"
              />
              <figcaption className="mt-2 text-sm text-gray-400">Figure 2.4: Queen Agent Conversational Interface</figcaption>
            </figure>
          </div>
        </Card>

        {/* Intent Recognition & Task-Driven Reasoning section */}
        <Card className="p-6 shadow-md bg-[#1A1F2C] text-white border border-[#2D3748]">
          <h3 className="text-2xl font-semibold mb-4 text-[#9b87f5]">Intent Recognition & Task-Driven Reasoning</h3>
          <p className="mb-4">
            AIO-2030 introduces a generative, intent-driven reasoning model as the cognitive engine behind agentic task execution. 
            Unlike traditional static AI services, the Queen Agent and the broader AIO Network evolve dynamically—not through 
            versioned model updates, but through compositional intelligence expansion as new capabilities and MCPs are added on-chain.
          </p>
          
          <div className="grid gap-6 my-6">
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">4.1 Generative Thought-Chain Execution</h4>
              <p className="text-gray-200 mb-2">
                Every task begins with natural language intent, parsed and interpreted by the Queen Agent into a multi-step 
                reasoning process known as a Think Context Chain. These reasoning chains:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Are dynamically constructed per session</li>
                <li>Reflect multi-modal inputs and real-time agent availability</li>
                <li>Leverage generative prompting to coordinate downstream AI responses</li>
              </ul>
              <p className="text-gray-200 mt-2">
                As the ecosystem grows, the network's collective intelligence increases—not by retraining, but by dynamically 
                composing more specialized, verified capabilities on demand.
              </p>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">4.2 Full On-Chain Cognitive Growth</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>
                  The Queen AI, in conjunction with a fully on-chain AIO-MCP Network, leverages Internet Computer Protocol (ICP) 
                  to host, verify, and invoke distributed intelligence.
                </li>
                <li>
                  As new MCP Servers are registered and verified on-chain, the capability pool expands, enabling the system to 
                  learn and grow at the protocol level.
                </li>
                <li>
                  The Queen Agent's cognitive graph is thus self-reinforcing, allowing for scalable general intelligence to 
                  emerge through decentralized composition.
                </li>
              </ul>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">4.3 Multi-Round Conversational Refinement</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>
                  Intent correction and refinement is enabled through multi-turn conversation and contextual memory.
                </li>
                <li>
                  The system incrementally improves intent resolution accuracy and capability recall rate by leveraging feedback 
                  from past interactions.
                </li>
                <li>
                  Over time, Queen Agent develops semantic priors based on task type, user profile, and interaction history—boosting 
                  relevance and minimizing hallucination.
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center flex-col items-center space-y-8 mt-6">
            <figure className="text-center">
              <img 
                src="/lovable-uploads/c08649b1-57f8-46b5-aa09-2b2605ecf8e6.png" 
                alt="Dialog Content Interface" 
                className="max-w-full rounded-lg border border-gray-600 shadow-lg"
              />
              <figcaption className="mt-2 text-sm text-gray-400">Figure 2.5: Dialog Content Interface with Response, Intent Analysis, and Execution Plan</figcaption>
            </figure>
            
            <figure className="text-center">
              <img 
                src="/lovable-uploads/df790484-8580-4d27-b0ae-95d829a61d2b.png" 
                alt="Conversational Intent Analysis" 
                className="max-w-full rounded-lg border border-gray-600 shadow-lg"
              />
              <figcaption className="mt-2 text-sm text-gray-400">Figure 2.6: Conversational Intent Analysis with Action Controls</figcaption>
            </figure>
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">4.4.2 Modality-Aware Decomposition</h4>
              <p className="text-gray-200 mb-3">
                The system identifies <strong>input and output modalities</strong> to construct the correct processing pipeline. In the current task:
              </p>
              <div className="bg-[#1E2231] p-3 rounded font-mono text-sm mb-3">
                <pre className="whitespace-pre-wrap text-gray-300">
{`"modalities": ["text", "image"],
"transformations": [
  "extract_text",
  "convert_text_to_image",
  "generate_image_collection"
]`}
                </pre>
              </div>
              <p className="text-gray-200 mb-3">This informs the Queen Agent to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Bind OCR capabilities to <strong>text extraction</strong></li>
                <li>Invoke generative models for <strong>text-to-image translation</strong></li>
                <li>Assemble outputs into <strong>multi-image packaging workflows</strong></li>
              </ul>
              <p className="text-gray-200 mt-2">
                This multimodal transformation is not hard-coded but <strong>reasoned dynamically</strong>, 
                ensuring maximum agent flexibility and plug-and-play extensibility.
              </p>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">4.4.3 Agentic Execution Plan</h4>
              <p className="text-gray-200 mb-3">
                The system translates the above goals into a <strong>stepwise execution plan</strong>, 
                each step tied to a specific <strong>MCP Server</strong> and <strong>method signature</strong>:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#1E2231] rounded-lg border border-[#3D4663]">
                  <thead>
                    <tr className="border-b border-[#3D4663]">
                      <th className="p-3 text-left text-gray-300">Step</th>
                      <th className="p-3 text-left text-gray-300">Action</th>
                      <th className="p-3 text-left text-gray-300">MCP</th>
                      <th className="p-3 text-left text-gray-300">Dependencies</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-[#3D4663]">
                      <td className="p-3">1</td>
                      <td className="p-3">extract_text</td>
                      <td className="p-3">text_processing</td>
                      <td className="p-3">prompt</td>
                    </tr>
                    <tr className="border-b border-[#3D4663]">
                      <td className="p-3">2</td>
                      <td className="p-3">convert_text_to_image</td>
                      <td className="p-3">text_to_image</td>
                      <td className="p-3">prompt</td>
                    </tr>
                    <tr>
                      <td className="p-3">3</td>
                      <td className="p-3">generate_image_collection</td>
                      <td className="p-3">image_collection</td>
                      <td className="p-3">images</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-gray-200 mt-4">
                Each step includes a structured <code className="bg-[#1E2231] px-1 rounded">inputSchema</code>, enabling the Queen Agent to perform:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Prompt transformation and validation</li>
                <li>Capability selection and routing</li>
                <li>Task graph tracing and on-chain logging</li>
              </ul>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">4.4.4 Quality-Aware Output Objectives</h4>
              <p className="text-gray-200 mb-3">
                The Queen Agent also enforces <strong>quality constraints</strong> on the final output:
              </p>
              <div className="bg-[#1E2231] p-3 rounded font-mono text-sm mb-3">
                <pre className="whitespace-pre-wrap text-gray-300">
{`"quality_metrics": ["image_resolution", "image_colors"]`}
                </pre>
              </div>
              <p className="text-gray-200">
                These are passed downstream to guide the behavior of generation models, forming part of the 
                <strong> feedback-based refinement loop</strong> in the Think Context Chain.
              </p>
            </div>
            
            <div className="h-px bg-gray-700 my-8"></div>
            
            <div>
              <p className="text-gray-200 mb-6">
                Through structured <strong>intent parsing</strong>, <strong>goal decomposition</strong>, and <strong>modality mapping</strong>, 
                the AIO-2030 system translates abstract user intent into a verifiable, multi-agent execution graph. This architecture enables:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300 mb-6">
                <li>No-code orchestration of AI tasks</li>
                <li>Transparent workload attribution</li>
                <li>Scalable intelligence assembly without retraining</li>
              </ul>
              <p className="text-gray-200 mb-6">
                It is this <strong>intent-to-chain transformation</strong> that powers AIO-2030's evolution from isolated agent execution 
                to decentralized, composable general intelligence.
              </p>
              
              <h4 className="text-lg font-semibold mb-3 text-[#D6BCFA]">Intent Structuring Format</h4>
              <p className="text-gray-200 mb-4">
                The decomposed structure is stored as a nested task schema within the AIO-Context Instance:
              </p>
              <div className="flex justify-center mb-8">
                <figure className="text-center">
                  <img 
                    src="/lovable-uploads/80d87232-3bfc-4c54-8e62-629b68a4f54d.png" 
                    alt="Intent Structuring Format" 
                    className="max-w-full rounded-lg border border-gray-600 shadow-lg"
                  />
                  <figcaption className="mt-2 text-sm text-gray-400">Figure 2.7: Intent Structuring Format Schema</figcaption>
                </figure>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#9b87f5]">4.5 Execution Plan & LLM-Based Agentic AI Executor</h3>
              <p className="text-gray-200 mb-6">
                The <strong>execution layer</strong> of AIO-2030 is powered by a <strong>Large Language Model (LLM)-driven agentic reasoning engine</strong>, 
                referred to as the <strong>AIO Agentic Executor</strong>. This executor interprets high-level intent structures and orchestrates 
                the full lifecycle of thought-chain execution through decentralized MCP Servers.
              </p>
              
              <div className="bg-[#252B3B] p-5 rounded-lg mb-5">
                <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">4.5.1 AI-Orchestrated Execution Context</h4>
                <p className="text-gray-200 mb-3">
                  Upon successful parsing of user intent, the <strong>Queen Agent</strong> constructs a session-scoped 
                  <code className="bg-[#1E2231] px-1 rounded mx-1">AIO-Executor Context</code>, which serves as the cognitive substrate 
                  for reasoning and execution. This context includes:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                  <li>Structured execution steps (<code className="bg-[#1E2231] px-1 rounded">execution_plan</code>)</li>
                  <li>Bound MCP capabilities per step</li>
                  <li>Schema constraints, dependencies, and modal bindings</li>
                  <li>Trace ID and priority metadata</li>
                </ul>
                <p className="text-gray-200 mt-3">
                  This context is dynamically generated and maintained across the task's lifetime, allowing for mid-process updates, 
                  fallback routing, and quality-controlled outputs.
                </p>
              </div>
              
              <div className="bg-[#252B3B] p-5 rounded-lg mb-5">
                <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">4.5.2 Chain-of-Thought Reasoning Across Agents</h4>
                <p className="text-gray-200 mb-3">
                  The LLM-based executor does not merely select tools—it <strong>infers reasoning chains</strong> across modular capabilities, generating:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                  <li>Prompts for subtask decomposition</li>
                  <li>Format-adaptive instructions per modality</li>
                  <li>
                    Reentrant intent resolution enables resilient, high-quality task execution by dynamically correcting subplans 
                    and reusing partial results without restarting the entire workflow.
                  </li>
                  <li>Multi-agent sequencing (parallel or sequential)</li>
                </ul>
                <p className="text-gray-200 mt-3">
                  This enables <strong>programmable reasoning-as-a-service</strong>, abstracted from any single backend model.
                </p>
              </div>
              
              <div className="bg-[#252B3B] p-5 rounded-lg">
                <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">4.5.3 On-Chain Registered AIO-MCP Integration</h4>
                <p className="text-gray-200 mb-3">Execution relies on capabilities that are:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                  <li>Registered on-chain via <strong>NFT-like MCP Contracts</strong></li>
                  <li>Verified through the <code className="bg-[#1E2231] px-1 rounded">AIO-MCP-help</code> protocol</li>
                  <li>Indexed in a <strong>capability knowledge graph</strong> curated by Queen Agent</li>
                </ul>
                
                <p className="text-gray-200 my-3">Each MCP Server in the execution plan is:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                  <li>Discoverable via on-chain inverted indexes</li>
                  <li>Invoked via structured <code className="bg-[#1E2231] px-1 rounded">method@namespace</code> calls</li>
                  <li>Metered through the Arbiter for incentive tracking</li>
                </ul>
                
                <p className="text-gray-200 mt-3">
                  This results in <strong>a hybrid off-chain/on-chain AI execution environment</strong>, where the LLM reasons, 
                  composes, and delegates across a globally distributed, verifiable, and composable intelligence layer.
                </p>
              </div>
            </div>
          </div>
          
          {/* Add the new image at the bottom of the card */}
          <div className="flex justify-center mt-10">
            <figure className="text-center">
              <img 
                src="/lovable-uploads/1e01a7d5-66df-4b90-95c0-fdfdb09ae24d.png" 
                alt="AIO-MCP Integration Workflow" 
                className="max-w-full rounded-lg border border-gray-600 shadow-lg"
              />
              <figcaption className="mt-2 text-sm text-gray-400">Figure 2.8: AIO-MCP On-Chain Integration Workflow</figcaption>
            </figure>
          </div>
        </Card>

        {/* On-Chain AIO Canister Contracts section - NEW CARD */}
        <Card className="p-6 shadow-md bg-[#1A1F2C] text-white border border-[#2D3748]">
          <h3 className="text-2xl font-semibold mb-4 text-[#9b87f5]">On-Chain AIO Canister Contracts</h3>
          <p className="mb-4">
            The AIO-Canister layer provides the on-chain trust foundation for the AIO-2030 ecosystem. It hosts the registries, 
            execution ledgers, and indexing structures that enable decentralized AI agents to be verifiable, discoverable, and 
            fairly incentivized across the Super AI Network.
          </p>
          
          <div className="grid gap-6 my-6">
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">5.1 Canister-AIO POD: Multi-Cloud and Native Deployments</h4>
              <p className="text-gray-200 mb-2">
                AIO-2030 supports flexible deployment of AIO-MCP Servers through the Canister-AIO POD model:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-300">
                <li>
                  <span className="font-medium">Self-hosted Cloud Support:</span> Developers can register their MCP endpoints 
                  deployed on any cloud platform or private infrastructure, including external agent networks such as Coze, 
                  a16z Eliza, and other AI ecosystems.
                </li>
                <li>
                  <span className="font-medium">Native AIO POD Runtime:</span> AIO-2030 offers an official POD runtime 
                  (AIO-POD) that integrates with distributed compute networks for permissionless, composable AI deployment.
                </li>
                <li>
                  <span className="font-medium">Super AI Network Integration:</span> All registered AIO-MCP Servers become 
                  part of the AIO Super AI Network, enabling seamless orchestration via the Queen Agent.
                </li>
              </ul>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">5.2 Workload Ledger: On-Chain Accounting for Effort & Attribution</h4>
              <p className="text-gray-200 mb-2">
                All task execution activity is logged to a Workload Ledger, capturing:
              </p>
              <div className="mb-4">
                <h5 className="font-medium text-blue-200 mb-1">Intent-to-MCP Execution Records</h5>
                <p className="text-gray-300">
                  For every intent processed, the full trace of participating MCP Servers, subtasks, and execution order is 
                  recorded on-chain.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-blue-200 mb-1">Capability Verification & Attribution</h5>
                <p className="text-gray-300 mb-2">
                  Every AIO-MCP Server undergoes capability verification and contract registration. The Queen Agent relies 
                  on on-chain data to:
                </p>
                <ul className="list-disc pl-8 space-y-1 text-gray-400">
                  <li>
                    Select candidates for execution based on verifiable reputation and declared capabilities
                  </li>
                  <li>
                    Perform fair scheduling using on-chain strategy AI
                  </li>
                  <li>
                    Allocate tokenized incentives directly to the responsible developer or provider
                  </li>
                </ul>
              </div>
              <p className="text-gray-200 mt-3">
                This guarantees transparency, fairness, and precise value attribution across the AI execution lifecycle.
              </p>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">5.3 On-Chain Inverted Index for Intent–Capability Mapping</h4>
              <p className="text-gray-200 mb-2">
                To enable efficient AI Agent retrieval and capability discovery, the AIO Network maintains an on-chain inverted index:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li>Maps user intents to eligible MCP Servers and their callable methods</li>
                <li>Built from verified AIO-MCP-help responses and developer-declared metadata</li>
                <li>Enables equality of discovery, ensuring all eligible MCPs are fairly surfaced during Queen Agent reasoning</li>
              </ul>
              <p className="text-gray-200 mt-3">
                Only MCPs that pass capability verification and meet contract criteria are added to this index—ensuring 
                trustless but qualified participation.
              </p>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">5.4 On-Chain Staking, Token Allocation & Incentive Billing</h4>
              <p className="text-gray-200 mb-2">
                Using ICP Canisters, the AIO Protocol manages:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li><span className="font-medium">Staking Validation:</span> Ensures every MCP has locked sufficient $AIO to participate in the agentic network</li>
                <li><span className="font-medium">Token Incentive Allocation:</span> Proportionally distributes $AIO based on task participation, workload size, and quality metrics</li>
                <li><span className="font-medium">Task-Level Billing:</span> Registers completed work as "invoiced" on-chain for immutable accounting</li>
              </ul>
              <p className="text-gray-200 mt-3">
                This framework underpins the economic engine of AIO-2030, tying compute effort directly to token reward 
                in a verifiable and programmable way.
              </p>
            </div>
            
            <div className="bg-[#252B3B] p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-[#D6BCFA]">5.5 Proof of Workload via Arbiter Consensus & AI Pins</h4>
              <p className="text-gray-200 mb-2">
                To ensure fair execution measurement, the ecosystem supports:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                <li><span className="font-medium">Arbiter Consensus Mechanisms:</span> On-chain agents (Arbiters) independently verify task traces, execution quality, and reported workload.</li>
                <li><span className="font-medium">AI Pins:</span> External service adapters acting as verified endpoints in the Queen Agent's orchestration graph, expanding reach to off-chain or third-party AI services.</li>
              </ul>
              <p className="text-gray-200 mt-3">
                Through these systems, Proof of Workload becomes a first-class primitive, enabling fair tokenization of AI 
                work across a decentralized agent economy.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <figure className="text-center">
              <img 
                src="/lovable-uploads/c007b8ef-e441-4739-970e-bb0fca0b0037.png" 
                alt="On-Chain AIO Canister Workflow" 
                className="max-w-full rounded-lg border border-gray-600 shadow-lg"
              />
              <figcaption className="mt-2 text-sm text-gray-400">Figure 2.9: On-Chain AIO Canister Workflow and Integration</figcaption>
            </figure>
          </div>
        </Card>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-3">Implementation Strategy</h3>
          <p>
            The AIO-2030 reference implementation uses a combination of technologies to create a scalable, 
            secure, and performant system:
          </p>
          
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li>
              <span className="font-medium">Core Protocol Layers:</span> Implemented in TypeScript for flexibility and developer accessibility
            </li>
            <li>
              <span className="font-medium">Performance-Critical Components:</span> Rust implementations for computationally intensive operations
            </li>
            <li>
              <span className="font-medium">On-Chain Interactions:</span> Smart contracts written for the Internet Computer Protocol (ICP)
            </li>
            <li>
              <span className="font-medium">Agent Runtime:</span> Docker-based AIO-POD for isolation and deployment flexibility
            </li>
            <li>
              <span className="font-medium">Distributed Networking:</span> WebRTC and P2P communication for resilient agent coordination
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chapter2;

