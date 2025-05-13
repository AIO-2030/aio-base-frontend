
---

# Agent MCP Capability Index Prompt Specification

> Version: 1.0  
> Author: sen yang x ChatGPT  
> Purpose: For LLM (GPT or other models) to analyze natural language, abstract MCP / AI Agent capabilities, and output a standardized capability index for Agent Registry systems.

---

## Usage Purpose
This prompt is designed for:

- MCP / AI Agent capability modeling
- Auto-generation of agent meta-info
- Multi-language scenario input (Chinese / Japanese / English)
- Output structured JSON for easy registry / retrieval / search

---

## Prompt Template (English)

```
#build_mcp_ability_index

You are an expert-level AI Agent Capability Extractor.

Task:  
Analyze the following natural language description (it may be written in Chinese, Japanese, or other languages).  
Extract and generate an abstract MCP / AI Agent capability definition.

Output Specification:
- Output must be in pure JSON format.
- Translate all field names, input parameters, output names into accurate, meaningful English.
- The output JSON should be easily used in an Agent Registry or API interface.

Output JSON Structure:

{
  "name": "string",                // Re-define a clear, accurate, and searchable MCP/Agent name in English
  "input": [                       // Extract structured input parameters
    {
      "keyname": "string",         // Must be English, based on scenario meaning
      "type": "string/integer/boolean/array/object"
    }
  ],
  "output": [                      // Define the output structure
    {
      "name": "string",            // Must be English
      "type": "string/blob/json/object/array"
    }
  ]
}

Rules:
- Understand the scenario requirements deeply.
- Identify the core capability or function.
- Extract the minimal necessary input parameters.
- Design a meaningful output schema.
- Translate all content into English.
- Output only pure JSON without extra explanations.

Below is the scenario description to analyze:
```

---

## Example Scenario (Chinese Input)

> Input:
```
#build_mcp_ability_index
我需要一个Agent，可以分析用户输入的一段话，并从本地 knowledge.json 文件中检索最相关的知识片段，并返回。
```

> Expected Output:
```json
{
  "name": "LocalKnowledgeRetrieval",
  "input": [
    {
      "keyname": "query_text",
      "type": "string"
    },
    {
      "keyname": "knowledge_path",
      "type": "string"
    }
  ],
  "output": [
    {
      "name": "retrieved_knowledge",
      "type": "json"
    }
  ]
}
```

---

## Notes

This prompt can be embedded into:

- Agent Registry System
- MCP Marketplace
- Auto Agent Design Tools
- Auto API Generator
- Knowledge Graph Builder

---
