
import React from 'react';
import { Card } from "../../components/ui/card";

const Chapter4 = () => {
  return (
    <div className="chapter">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">Token Incentives & Economic Model</h2>
      
      <div className="space-y-10">
        <section>
          <h3 className="text-2xl font-semibold mb-4">1. Token Issuance</h3>
          <Card className="p-6 bg-slate-800 text-white shadow-xl border border-slate-600">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg text-teal-300">Total Supply</h4>
                <p className="text-slate-100">The total supply of <strong className="text-yellow-300">{"$AIO tokens"}</strong> is <strong className="text-yellow-300">21,000,000,000,000,000</strong> (with 8 decimal places of precision).</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-teal-300">Initial Circulating Supply</h4>
                <p className="text-slate-100">Tokens will be released in batches according to community governance rules (SNS), ensuring a smooth market transition and the healthy development of the ecosystem.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-teal-300">Staking Requirements & Incentive Coefficients</h4>
                <p className="text-slate-100">Users and developers must stake <strong className="text-yellow-300">{"$AIO tokens"}</strong> to participate in the ecosystem. The staked amount not only serves as the <strong className="text-teal-200">participation threshold</strong> but also acts as an <strong className="text-teal-200">incentive coefficient</strong> (denoted as <code className="bg-slate-950 px-1 rounded">κ</code>). The higher the stake, the greater the reward multiplier.</p>
              </div>
            </div>
          </Card>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold mb-4">2. Developer & Participant Incentive Structure</h3>
          <p className="text-lg mb-4">
            To encourage active participation, high-quality contributions, and long-term alignment with the AIO-2030 ecosystem, 
            a structured and tokenized incentive framework has been established. Rewards are transparently distributed via 
            on-chain smart contracts based on verifiable actions and workload proofs.
          </p>
          
          <Card className="p-6 mb-6 bg-slate-800 text-white shadow-xl border border-slate-600">
            <h4 className="text-xl font-semibold mb-3 text-indigo-300">2.1 Developer Onboarding & Initial Grant</h4>
            <ul className="list-disc pl-5 space-y-2 text-slate-100">
              <li>Developers integrate into the AIO ecosystem by submitting <strong className="text-indigo-200">AIO-MCP Servers</strong>.</li>
              <li>
                Upon successful verification through the <code className="bg-slate-950 px-1 rounded">help</code> protocol and LLM-based inverted index reasoning, 
                developers receive an <strong className="text-indigo-200">initial grant</strong> calculated as:
              </li>
            </ul>
            
            <div className="bg-slate-950 p-4 my-4 rounded-md text-center">
              <code className="text-lg text-yellow-300">Initial Grant = LLM Capability Score × Indexing Weight</code>
            </div>
            
            <h5 className="font-semibold mt-4 mb-2 text-indigo-300">Grant Composition:</h5>
            <ul className="list-disc pl-5 space-y-1 text-slate-100">
              <li><strong className="text-indigo-200">50% is auto-staked</strong> as mandatory collateral</li>
              <li>The remaining <strong className="text-indigo-200">50% is linearly released</strong> over 18 months, based on workload contribution and active uptime</li>
              <li>Developers may increase their <strong className="text-indigo-200">staking weight</strong> by voluntarily locking additional {"$AIO"} tokens, which boosts future incentive multipliers.</li>
            </ul>
          </Card>
          
          <Card className="p-6 mb-6 bg-slate-800 text-white shadow-xl border border-slate-600">
            <h4 className="text-xl font-semibold mb-3 text-indigo-300">2.2 Token Distribution Formula</h4>
            <p className="mb-3 text-slate-100">For each task, token rewards are determined by the following weighted factors:</p>
            
            <div className="bg-slate-950 p-4 my-4 rounded-md text-center">
              <code className="text-lg text-yellow-300">Reward = Participation Volume × Execution Quality × Staking Weight</code>
            </div>
            
            <p className="text-slate-100">All rewards are recorded in the on-chain <strong className="text-indigo-200">Incentive Ledger</strong> after being validated by the Arbiter consensus mechanism.</p>
          </Card>
          
          <Card className="p-6 bg-slate-800 text-white shadow-xl border border-slate-600">
            <h4 className="text-xl font-semibold mb-4 text-indigo-300">2.3 Reward Categories</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-900/90 p-5 rounded-lg shadow-md border border-blue-700">
                <h5 className="font-semibold text-lg mb-2 text-blue-300">Submission Reward</h5>
                <p className="mb-2 text-slate-100">Developers submitting new AI Agents or MCP Servers (compliant with AIO Protocol and verified on-chain) receive:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-100">
                  <li><strong className="text-blue-200">Base Reward:</strong> 10,000 {"$AIO"}</li>
                  <li><strong className="text-blue-200">Boost Multiplier:</strong> Proportional to developer's current staking coefficient</li>
                </ul>
              </div>
              
              <div className="bg-green-900/90 p-5 rounded-lg shadow-md border border-green-700">
                <h5 className="font-semibold text-lg mb-2 text-green-300">Invocation Reward</h5>
                <p className="mb-2 text-slate-100">Every successful call to a registered AI Agent or MCP Server receives:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-100">
                  <li><strong className="text-green-200">Base Reward:</strong> 3,000 {"$AIO"}</li>
                  <li><strong className="text-green-200">Adjusted by:</strong> User's staking amount (higher stake → higher multiplier)</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/90 p-5 rounded-lg shadow-md border border-purple-700">
                <h5 className="font-semibold text-lg mb-2 text-purple-300">Subscription Revenue Sharing</h5>
                <p className="mb-2 text-slate-100">When users subscribe to <strong className="text-purple-200">Queen Agent services</strong>:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-100">
                  <li><strong className="text-purple-200">50% of the subscription fee</strong> is pooled</li>
                  <li>The pool is evenly redistributed across all contributing MCP Servers and AI Agents in that execution path</li>
                  <li><strong className="text-purple-200">Staking Coefficients</strong> amplify each participant's share</li>
                </ul>
              </div>
              
              <div className="bg-amber-900/90 p-5 rounded-lg shadow-md border border-amber-700">
                <h5 className="font-semibold text-lg mb-2 text-amber-300">Asset Download Reward</h5>
                <p className="mb-2 text-slate-100">Whenever users download ecosystem resources (e.g., open-source code, models, datasets):</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-100">
                  <li><strong className="text-amber-200">Base Reward:</strong> 1,000 {"$AIO"}</li>
                  <li><strong className="text-amber-200">Bonus:</strong> Additional rewards based on user staking amount</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-indigo-900/90 p-5 rounded-lg shadow-md border border-indigo-700">
              <h5 className="font-semibold text-lg mb-2 text-indigo-300">Long-Term Contribution Bonus</h5>
              <p className="mb-2 text-slate-100">To reward developers or teams that contribute significantly over time, the protocol includes periodic bonus distributions based on:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-100">
                <li><strong className="text-indigo-200">Cumulative Stake Volume</strong></li>
                <li><strong className="text-indigo-200">Depth and frequency of ecosystem contributions</strong></li>
                <li><strong className="text-indigo-200">Token Multiplier:</strong> Directly proportional to the contributor's stake weight</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <p className="text-lg text-slate-100">
                The {"$AIO"} token incentive framework aligns all ecosystem participants—from developers and operators to consumers—through 
                a transparent, measurable, and stake-weighted reward model. This approach supports sustainable growth, encourages 
                high-value contributions, and promotes long-term network health.
              </p>
            </div>
          </Card>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold mb-4">3. Token Economic Model</h3>
          <Card className="p-6 bg-slate-800 text-white shadow-xl border border-slate-600">
            <p className="mb-4 text-slate-100">
              The AIO-2030 economic model is driven by smart contracts that enable self-incentivizing mechanisms and value transfer.
              The core components of the model include:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg text-teal-300">Endogenous Economic Loop</h4>
                <p className="text-slate-100"><strong className="text-yellow-300">{"$AIO tokens"}</strong> are used within the ecosystem to pay for calls, storage, and compute fees, creating an internal token circulation system.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-teal-300">Staking & Incentive Linkage</h4>
                <p className="text-slate-100">
                  Staking is not only a participation threshold but also a critical factor for incentive rewards (denoted as <code className="bg-slate-950 px-1 rounded">κ</code>), 
                  encouraging long-term token holding, higher governance rights, and economic returns.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-teal-300">Compute Support & Payment</h4>
                <p className="text-slate-100">
                  AIO-2030 is powered by <strong className="text-yellow-300">{"$EMC"}</strong>, which supports Queen Agent's compute resources. Based on 
                  <strong className="text-yellow-300">{" $AIO traffic * compute coefficient "}</strong> $ U $, the corresponding <strong className="text-yellow-300">{"$AIO tokens"}</strong> will be 
                  burned, with <strong className="text-yellow-300">{"$EMC payments"}</strong> made for the compute power used.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-teal-300">Token Burn Mechanism</h4>
                <p className="text-slate-100">
                  A portion of service fees is used to <strong className="text-yellow-300">{"burn $AIO tokens"}</strong> through smart contracts, 
                  reducing circulating supply and increasing token scarcity and long-term value.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-teal-300">Decentralized Governance</h4>
                <p className="text-slate-100">
                  Through a DAO model, <strong className="text-yellow-300">{"$AIO token holders"}</strong> participate in governance, voting on protocol upgrades, 
                  parameter adjustments, and resource allocation. Governance weight is tied to the amount of tokens staked by each user, 
                  ensuring transparency and fairness in the decision-making process.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-teal-300">Market Liquidity & Scalability</h4>
                <p className="text-slate-100">
                  In addition to internal ecosystem transactions, <strong className="text-yellow-300">{"$AIO tokens"}</strong> will circulate on external exchanges, 
                  providing additional economic incentives and investment returns to users, while also supporting a broader range of real-world use cases.
                </p>
              </div>
            </div>
          </Card>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold mb-4">4. Token Economic Model Metrics & Expected Calculations</h3>
          <Card className="p-6 bg-slate-800 text-white shadow-xl border border-slate-600">
            <div className="flex justify-center mb-6">
              <figure className="text-center w-full">
                <img 
                  src="/lovable-uploads/b992fa50-69c2-4cb4-a472-f10da7468aff.png" 
                  alt="Token Economy Diagram" 
                  className="max-w-lg mx-auto rounded-lg border border-indigo-500 shadow-lg glow-effect"
                />
                <figcaption className="mt-2 text-sm text-slate-300">Token Economy Diagram - showing the relationship between Usage Value, Compute Value, Governance Value and Circulating Supply</figcaption>
              </figure>
            </div>
            
            <p className="mb-4 text-slate-100">
              To assess the market performance and liquidity of the <strong className="text-yellow-300">{"$AIO"}</strong> token, the following key metrics 
              and expected calculation formulas are proposed:
            </p>
            
            <div className="bg-slate-950 p-5 rounded-lg shadow-md mb-6 border border-cyan-900">
              <h4 className="font-semibold text-lg mb-3 text-cyan-300">Parameter Definitions</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-100">
                <li><strong className="text-cyan-200">Total Supply (TS):</strong> 21,000,000,000,000,000 {"$AIO"}</li>
                <li><strong className="text-cyan-200">Circulating Supply (CS):</strong> The actual circulating tokens released according to governance rules.</li>
                <li><strong className="text-cyan-200">Total Staked (S):</strong> The total amount of <strong className="text-yellow-300">{"$AIO"}</strong> staked by all users within the ecosystem</li>
                <li><strong className="text-cyan-200">Market Value (M):</strong> $ M = {"P_{AIO}"} \times CS $</li>
                <li><strong className="text-cyan-200">Liquidity (L):</strong> L = Trading Volume / M<br/>
                (Reflects the ratio of actual trading volume relative to the market value)</li>
              </ul>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-lg shadow-md mb-6 border border-cyan-900">
              <h4 className="font-semibold text-lg mb-3 text-cyan-300">Token Price Forecasting Formula</h4>
              <p className="mb-3 text-slate-100">
                Assuming that the total network value is composed of <strong className="text-cyan-200">ecosystem utility</strong>, <strong className="text-cyan-200">compute-backed value</strong>, 
                and <strong className="text-cyan-200">governance value</strong>, the expected price of <strong className="text-yellow-300">{"$AIO"}</strong> is calculated as follows:
              </p>
              
              <div className="bg-indigo-950 p-4 my-4 rounded-md text-center border border-indigo-800">
                <p className="font-mono text-yellow-300">P<sub>AIO</sub> = (V<sub>usage</sub> + V<sub>compute</sub> + V<sub>governance</sub>) / CS</p>
              </div>
              
              <p className="mb-2 text-slate-100">Where:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-100">
                <li><strong className="text-cyan-200">V<sub>usage</sub>:</strong> Total value generated by services within the ecosystem</li>
                <li><strong className="text-cyan-200">V<sub>compute</sub>:</strong> Value derived from payments for compute resources through <strong className="text-yellow-300">{"$EMC"}</strong></li>
                <li><strong className="text-cyan-200">V<sub>governance</sub>:</strong> Long-term value driven by DAO governance participation</li>
              </ul>
              
              <p className="mt-4 text-slate-100">
                Considering the staking incentive coefficient <strong className="text-cyan-200">κ</strong> (the higher the stake, the greater the coefficient, 
                with <strong className="text-cyan-200">κ {`>`} 1</strong>), the expected market price of the token is:
              </p>
              
              <div className="bg-indigo-950 p-4 my-4 rounded-md text-center border border-indigo-800">
                <p className="font-mono text-yellow-300">P<sub>AIO</sub><sup>expected</sup> = ((V<sub>usage</sub> + V<sub>compute</sub> + V<sub>governance</sub>) × κ) / CS</p>
              </div>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-lg shadow-md border border-cyan-900">
              <h4 className="font-semibold text-lg mb-3 text-cyan-300">Diagram Explanation</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-100">
                <li><strong className="text-cyan-200">Total Supply (TS)</strong> and <strong className="text-cyan-200">Circulating Supply (CS)</strong> form the base of the token economy.</li>
                <li><strong className="text-cyan-200">Total Staked (S)</strong>, influenced by the <strong className="text-cyan-200">incentive coefficient (κ)</strong>, determines the amplification effect of rewards.</li>
                <li><strong className="text-cyan-200">Ecosystem Usage</strong>, <strong className="text-cyan-200">Compute Support</strong>, and <strong className="text-cyan-200">Governance Value</strong> collectively contribute to the <strong className="text-cyan-200">Market Value (M)</strong>, which is divided by the circulating supply and multiplied by the incentive coefficient to derive the <strong className="text-cyan-200">expected token market price</strong>.</li>
                <li><strong className="text-cyan-200">Liquidity (L)</strong> reflects the ratio of actual trading volume to market value, representing market activity and liquidity.</li>
              </ul>
            </div>
          </Card>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold mb-4">Incentive Model Overview</h3>
          <Card className="p-6 bg-slate-800 text-white shadow-xl border border-slate-600">
            <ul className="list-disc pl-5 space-y-3 text-slate-100">
              <li><strong className="text-teal-300">Native Token:</strong> <code className="bg-slate-950 px-2 py-1 rounded text-yellow-300">{"$AIO"}</code></li>
              <li>
                <strong className="text-teal-300">Incentive Rules:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-100">
                  <li>Agents are required to stake <code className="bg-slate-950 px-1 rounded text-yellow-300">{"$AIO"}</code> in order to register and operate within the AIO network.</li>
                  <li>
                    Token rewards are distributed based on the formula:<br/>
                    <strong className="ml-2 text-teal-200">Task Participation × Service Quality × Staking Weight</strong>
                  </li>
                  <li>Each task execution is validated by the <strong className="text-teal-200">Arbiter</strong> through a decentralized consensus mechanism and recorded into the on-chain incentive ledger.</li>
                </ul>
              </li>
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Chapter4;
