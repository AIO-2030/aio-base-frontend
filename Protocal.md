
# 📘 AIO-MCP Protocol Technical Whitepaper (English Version)

## Version: v1.2.1
> Integrated MCP standard, namespace mechanism, and execution trace support

---

## 4. Execution Trace Structure & Tracing Mechanism (Hybrid Compatible)

> Applicable to AIO + MCP hybrid agent invocation scenarios  
> Supports trace_id + id for accurate positioning and cross-protocol tracing  
> Enables visualization, on-chain logging, incentive calculation, and contribution analysis

---

### 🔧 Design Principles

| Field         | Description |
|---------------|-------------|
| `trace_id`    | Globally unique task identifier issued by the Queen Agent |
| `id`          | Local identifier of this step within the trace |
| `trace_id#id` | Globally unique call ID, usable for on-chain, billing, auditing |
| `protocol`    | Declares communication protocol used: `aio` or `mcp` |
| `type`        | Transport type: stdio / http / mcp |
| `method`      | Fully qualified method, e.g., `agent::sampling.start` |
| `partial`     | Whether this is a partial (e.g., streaming/SSE) result |

---

### ✅ Trace Structure Example (Hybrid AIO + MCP)

```json
{
  "trace_id": "AIO-TR-20250326-0001",
  "calls": [
    {
      "id": 1,
      "protocol": "aio",
      "agent": "pdf_reader",
      "type": "stdio",
      "method": "pdf_reader::input",
      "inputs": [{
        "type": "file",
        "value": "base64-pdf-data"
      }],
      "outputs": [{
        "type": "text",
        "value": "Extracted content..."
      }],
      "status": "ok"
    },
    {
      "id": 2,
      "protocol": "mcp",
      "agent": "summarizer",
      "type": "mcp",
      "method": "summarizer::sampling.start",
      "inputs": [{
        "type": "text",
        "value": "Extracted content..."
      }],
      "outputs": [{
        "type": "text",
        "value": "Here is the summary."
      }],
      "status": "ok"
    }
  ]
}
```

---

### 🧠 Field Reference (Each Call Record)

| Field     | Type     | Description |
|-----------|----------|-------------|
| `id`      | int      | Local step ID within the trace |
| `protocol`| string   | `aio` or `mcp` |
| `type`    | string   | Agent transport type |
| `agent`   | string   | Agent name |
| `method`  | string   | Namespaced method |
| `inputs`  | array    | Input parameters (supports multimodal) |
| `outputs` | array    | Output data |
| `status`  | string   | Status: `ok` / `error` |
| `partial` | boolean? | True if intermediate/partial result |

---

### 🧩 Hybrid Workflow Scenarios

Typical mixed workflows within the AIO agent network:

```plaintext
[Text Parser Agent (stdio)]
         ↓
[Structured Extractor Agent (http)]
         ↓
[Summarization Agent (mcp::sampling.start)]
         ↓
[Decision Router Agent (mcp::tools.call)]
```

---

### 🔗 Use Cases: On-chain Tracing and Incentives

- Each `trace_id#id` can be hashed into a unique transaction record
- Agent + status/output enables service quality scoring
- Token distribution smart contracts can use these to compute rewards
  based on task volume, frequency, and quality
