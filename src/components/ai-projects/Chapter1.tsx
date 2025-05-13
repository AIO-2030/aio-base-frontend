
import React from 'react';
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const Chapter1 = () => {
  return (
    <div className="chapter">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">Chapter 1: Introducing Protocol Analysis for Web3 AIOps</h2>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">Vision & Core Concepts</h3>
          <p className="mb-4">
            AIO-2030 (Super AI Decentralized Network) aims to fundamentally reconstruct the AI ecosystem and interaction paradigm. 
            By leveraging decentralized networks and blockchain technology, AIO-2030 introduces the De-Super Agentic AI Network, 
            a contract-based agent registration framework, on-chain task traceability, and incentive mechanisms—ultimately 
            building an open, trustworthy, and composable AI Agent collaboration network.
          </p>
          <p className="mb-4">
            At the core of AIO-2030 lies the belief that agentic AI reasoning is driven by a Queen Agent, which orchestrates 
            cognitive processes via large language models (LLMs). Human contributors participate by providing generalized AIO-MCPs 
            (Model Capability Protocols) and assist the reasoning chain through structured inputs under the AIO Protocol.
          </p>
        </div>

        <Card className="p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Key Protocol Features</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>JSON-RPC based communication standard with trace-id mechanism for cross-agent coordination</li>
            <li>Support for diverse modalities (text, images, audio) and multi-modal task compatibility</li>
            <li>MCP-compatible for integration with existing systems through standardized interfaces</li>
            <li>Chain-aware primitives for on-chain operations and task traceability</li>
            <li>NFT-like smart contract framework for agent registration and verification</li>
            <li>Tokenized incentive infrastructure for fair compensation across the network</li>
          </ul>
        </Card>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-3">Toward Unbounded Super AI</h3>
          <p>
            The ultimate vision of Web3 + AI is to build a free and unbounded Super AI through cryptographic trust, 
            decentralized infrastructure, and collective intelligence. By aggregating decentralized AIO MCP Server nodes 
            through consensus-driven coordination, the AIO-2030 Agentic AI Network is poised to become a foundational 
            architecture capable of hosting and evolving toward Superintelligence.
          </p>
          <p className="mt-3">
            AIO-2030 establishes a unified AIO Protocol that leverages blockchain-native smart contracts to enable 
            seamless interoperability between AI Agents and MCP Servers. This framework transforms the AI ecosystem 
            from isolated intelligence to collective cognition and knowledge.
          </p>
          
          <div className="my-6 flex justify-center">
            <img 
              src="/lovable-uploads/01387ace-1f59-4ae4-809c-2ef1ff8931fb.png" 
              alt="AIO Protocol Diagram" 
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-3">AIO-2030: An Open, Composable, and Incentivized Agentic AI Network</h3>
          <p className="mb-4">
            AIO-2030 is designed to establish an <strong>open, composable, and incentive-aligned autonomous network for agentic AI</strong>. 
            By leveraging the AIO Protocol to construct verifiable <strong>chains of thought</strong>, enable <strong>smart contract–based agent registration</strong>, 
            and enforce <strong>provable execution paths</strong>, AIO-2030 bridges users, developers, AI Agent runtimes, and intelligent 
            reasoning clusters into a unified, collaborative infrastructure.
          </p>
          <p className="mb-4">
            This paradigm shift transforms AI Agents from siloed systems into a <strong>cooperative agentic ecosystem</strong>, 
            where reasoning, execution, and incentives are seamlessly coordinated across decentralized infrastructure.
          </p>
          
          {/* Network architecture image removed as requested */}
        </div>

        <div className="my-10 flex justify-center">
          <img 
            src="/lovable-uploads/038eba5a-4e0c-4fe0-8ae2-826e8d59a1b9.png" 
            alt="AIO Network Architecture" 
            className="max-w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Key Roles and Components in the AIO-2030 Ecosystem</h3>
          
          <div className="overflow-x-auto">
            <Table className="w-full border-collapse bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg shadow-xl">
              <TableHeader>
                <TableRow className="border-b border-white/10">
                  <TableHead className="py-4 px-6 text-left font-semibold text-blue-300 bg-gradient-to-r from-blue-900/40 to-indigo-900/40">Role / Component</TableHead>
                  <TableHead className="py-4 px-6 text-left font-semibold text-blue-300 bg-gradient-to-r from-blue-900/40 to-indigo-900/40">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="py-4 px-6 font-medium text-blue-100">User</TableCell>
                  <TableCell className="py-4 px-6">
                    Initiates AI tasks by submitting intent-based requests. The <strong>Queen Agent</strong> responds by generating 
                    a dedicated <strong>AIO-Context Instance</strong>, orchestrating service composition and execution via the agentic network.
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="py-4 px-6 font-medium text-blue-100">Developer</TableCell>
                  <TableCell className="py-4 px-6">
                    Contributes to the ecosystem by uploading or registering custom-built <strong>AI Agents</strong> or <strong>MCP Servers</strong> 
                    to the AIO Network. Through the <strong>AIO-INF</strong> protocol and <strong>AIO-Tokenize</strong> smart contracts, 
                    developers gain access to grants and invocation-based rewards.
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="py-4 px-6 font-medium text-blue-100">Queen Agent</TableCell>
                  <TableCell className="py-4 px-6">
                    The core superintelligence of AIO-2030. It transcends individual agents and MCP nodes by serving as a high-dimensional 
                    orchestrator—managing <strong>capability discovery</strong>, <strong>thought-chain execution</strong>, 
                    and <strong>ecosystem-wide intelligence integration</strong>.
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="py-4 px-6 font-medium text-blue-100">Arbiter</TableCell>
                  <TableCell className="py-4 px-6">
                    The execution layer of the <strong>AIO-Tokenization Protocol</strong>, implemented as a smart contract via <strong>ICP Canisters</strong>. 
                    It governs token-based operations including grants, staking, usage accounting, and incentive distribution for ecosystem participants.
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="py-4 px-6 font-medium text-blue-100">AIO-MCP Server</TableCell>
                  <TableCell className="py-4 px-6">
                    Generalized AI service nodes participating in AIO-2030, encompassing (but not limited to) providers such as OpenAI, Claude, Gemini, 
                    as well as independent/self-hosted agents, tools, RAG services, and canister-based modules—exposed via standardized
                    <strong> AIO-INF EndPoint instances</strong>.
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="py-4 px-6 font-medium text-blue-100">Smart Contract (Canister)</TableCell>
                  <TableCell className="py-4 px-6">
                    Acts as the trust anchor of the network. Manages Agent registration, staking validation, incentive disbursement, 
                    and behavioral tracking on-chain.
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-white/5 transition-colors">
                  <TableCell className="py-4 px-6 font-medium text-blue-100">AI Pin</TableCell>
                  <TableCell className="py-4 px-6">
                    An external <strong>EndPoint interface</strong> exposed by the Queen Agent. Serves as the bridge between the agentic ecosystem 
                    and external services, enabling integration with off-chain or non-native AI infrastructures.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-[#0a1120] text-white p-5 rounded-lg mt-6">
          <h3 className="text-xl font-semibold mb-3">Core Benefits</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Developers retain ownership of their digital assets and models</li>
            <li>Invocation records and workload contributions are transparently logged on a distributed ledger</li>
            <li>User data benefits from on-chain provenance and privacy-preserving controls</li>
            <li>Tokenized incentive system fosters a transparent, automated, and self-sustaining AI ecosystem</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chapter1;
