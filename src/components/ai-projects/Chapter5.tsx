
import React from 'react';
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const Chapter5 = () => {
  return (
    <div className="chapter">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">Ecosystem Comparison: AIO vs Mainstream Agent Platforms</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold mb-4">Capability Matrix: AIO-2030 vs Doubao, Coze, Eliza, Wordware, POE, Mauns</h3>
          
          <div className="overflow-x-auto">
            <Table className="w-full border-collapse bg-slate-800 text-white rounded-lg shadow-xl">
              <TableHeader>
                <TableRow className="border-b border-slate-600">
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Dimension</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">AIO-2030</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Doubao</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Coze (ByteDance)</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Eliza (a16z)</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Wordware</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">POE (Quora)</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Mauns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">Positioning</TableCell>
                  <TableCell className="py-3 px-4">Decentralized agent protocol + incentive economy</TableCell>
                  <TableCell className="py-3 px-4">SaaS-style bot tool</TableCell>
                  <TableCell className="py-3 px-4">No-code enterprise automation</TableCell>
                  <TableCell className="py-3 px-4">Persona-based multi-agent dialog</TableCell>
                  <TableCell className="py-3 px-4">AI-assisted document writing tool</TableCell>
                  <TableCell className="py-3 px-4">Multi-model LLM query interface</TableCell>
                  <TableCell className="py-3 px-4">Agentic OS infrastructure concept</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">Target Users</TableCell>
                  <TableCell className="py-3 px-4">Developers, model providers, Web3 builders</TableCell>
                  <TableCell className="py-3 px-4">General productivity users</TableCell>
                  <TableCell className="py-3 px-4">Enterprise teams (workflow focused)</TableCell>
                  <TableCell className="py-3 px-4">Early adopters, agent-based consumers</TableCell>
                  <TableCell className="py-3 px-4">Content creators, document workers</TableCell>
                  <TableCell className="py-3 px-4">LLM users, info seekers</TableCell>
                  <TableCell className="py-3 px-4">Protocol designers, agent stack builders</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">Core Capabilities</TableCell>
                  <TableCell className="py-3 px-4">⚙️ Agent registration + Queen scheduling + task traceability + token incentives</TableCell>
                  <TableCell className="py-3 px-4">🧩 Flow bots + rule logic</TableCell>
                  <TableCell className="py-3 px-4">🧠 Multimodal bots + plugin actions</TableCell>
                  <TableCell className="py-3 px-4">🧠 Agent memory + chat personality</TableCell>
                  <TableCell className="py-3 px-4">✍️ Document generation + extensions</TableCell>
                  <TableCell className="py-3 px-4">🧠 Model routing + prompt history</TableCell>
                  <TableCell className="py-3 px-4">⚙️ Agent VM + programmable execution</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">Multi-agent Collaboration</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Fully supported via Queen Agent & traceable task chains</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Not supported</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️ Limited via step flows</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Supported internally</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Not supported</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️ Model selection only</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Architecturally designed for it</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">Open-source / Self-hosting</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Docker/KVM/API-supported</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Closed SaaS</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Proprietary</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Closed, managed environment</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Plugin-only</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Closed</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Theoretically self-hostable</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">Protocol Standardization</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ JSON-RPC + AIO extension</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Custom functions</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Internal message model</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️ API-based but non-extensible</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ No exposed interfaces</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️ Prompt API only</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Aims for standardized coordination</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">Runtime Abstraction</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Docker / Wasm / Remote API</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Server-based SaaS only</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Hosted bot studio</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Cloud-based only</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️ Embedded in specific app</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ No runtime isolation</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ VM sandbox & runtime separation</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">On-chain Traceability</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Task history + staking + reward logs on ICP</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ None</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ None</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ None</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ None</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ None</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ (planned, supports DAG/filecoin etc.)</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">Token Incentive Model</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ $AIO staking, task-based reward, governance-ready</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Subscription-based</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ No token logic</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ No token model</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ None</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ None</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️ Concept only, no native token yet</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">External AI Interoperability</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Any registered agent via Queen Agent</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Internal bots only</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️ Within closed platform</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ With limitations</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌ Closed</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️ Model selection only</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅ Designed for multi-agent linking</TableCell>
                </TableRow>
                
                <TableRow className="hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-teal-300">Ecosystem Expandability</TableCell>
                  <TableCell className="py-3 px-4">🌐 Agent NFT registry + Web3 integration</TableCell>
                  <TableCell className="py-3 px-4">❌ Platform-bound</TableCell>
                  <TableCell className="py-3 px-4">⚠️ ByteDance ecosystem</TableCell>
                  <TableCell className="py-3 px-4">🌱 Emerging, focused on UX</TableCell>
                  <TableCell className="py-3 px-4">📎 Single-app utility</TableCell>
                  <TableCell className="py-3 px-4">🌍 Multi-model interface</TableCell>
                  <TableCell className="py-3 px-4">🧠 Open concept, modular architecture</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Ecosystem Capability Snapshot</h3>
          
          <div className="overflow-x-auto">
            <Table className="w-full border-collapse bg-slate-800 text-white rounded-lg shadow-xl">
              <TableHeader>
                <TableRow className="border-b border-slate-600">
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Platform</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Collaboration</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Decentralized</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Protocol Standardization</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Runtime Isolation</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Token Economy</TableHead>
                  <TableHead className="py-4 px-4 text-left font-bold text-blue-300 bg-slate-900">Strategic Direction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-indigo-300">AIO-2030</TableCell>
                  <TableCell className="py-3 px-4 text-amber-400">⭐⭐⭐⭐⭐</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅</TableCell>
                  <TableCell className="py-3 px-4">Web3 + AI computational infrastructure</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-indigo-300">Mauns</TableCell>
                  <TableCell className="py-3 px-4 text-amber-400">⭐⭐⭐⭐</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅</TableCell>
                  <TableCell className="py-3 px-4 text-green-400">✅</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️</TableCell>
                  <TableCell className="py-3 px-4">Agent-native Web3 operating system</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-indigo-300">Doubao</TableCell>
                  <TableCell className="py-3 px-4 text-amber-400">⭐</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4">Enterprise-centric closed-loop automation</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-indigo-300">Coze</TableCell>
                  <TableCell className="py-3 px-4 text-amber-400">⭐⭐</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4">SaaS-style automation & workflow platform</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-indigo-300">Eliza</TableCell>
                  <TableCell className="py-3 px-4 text-amber-400">⭐⭐⭐</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4">Intelligent personas / multi-agent UX layer</TableCell>
                </TableRow>
                
                <TableRow className="border-b border-slate-700 hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-indigo-300">Wordware</TableCell>
                  <TableCell className="py-3 px-4 text-amber-400">⭐</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4">Document-focused AI assistant (plugin model)</TableCell>
                </TableRow>
                
                <TableRow className="hover:bg-slate-700/50">
                  <TableCell className="py-3 px-4 font-medium text-indigo-300">POE</TableCell>
                  <TableCell className="py-3 px-4 text-amber-400">⭐⭐</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-yellow-400">⚠️</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4 text-red-400">❌</TableCell>
                  <TableCell className="py-3 px-4"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Chapter5;
