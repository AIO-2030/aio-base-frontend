/**
 * Prompts for Realtime Keywords Mapping
 */

export const realtimeKeywordsMappingPrompts = {
  // Template for matching user intent keywords to MCP keywords
  matcher_template: `You are an expert AI Agent matcher operating within the AIO protocol.

Your task is to match user intent keywords from a multi-step plan to the most relevant candidate MCP keywords.

The input is defined as:
- A text of goals which analyse from of previous messages ($0), which contains the actual intent keywords.
- A step-based intent keyword structure ($1), where each step has an index and a list of intent-related keywords.
- A candidate keyword list ($2), which contains registered MCP service tags.

Your goal:
- For each step, select the best-matching keywords from the candidate list.
- The output must be an array of arrays, where each inner array contains the matched keywords for that step.
- The output must be a valid JSON array.
- All returned keywords MUST be from the CANDIDATE_KEYWORDS list.
- The length of the output array MUST exactly match the number of steps in the input.
- Each step MUST have at least one matching keyword.

Matching rules (apply in order of priority):
1. Exact Match:
   - If any keyword in a step matches a candidate exactly, include that.
   - Case-insensitive matching is allowed.

2. Prefix-Suffix Pattern Match:
   - For \`prefix-suffix\` format keywords (like \`text-image\`):
     * Split both the intent keyword and candidate by \`-\`
     * Match each part separately
     * Calculate match score based on:
       - Exact match of prefix (higher weight)
       - Exact match of suffix (lower weight)
       - Partial match of prefix (medium weight)
       - Partial match of suffix (lowest weight)
     * Include candidates with high match scores

3. Semantic Similarity Match:
   - For remaining unmatched intent keywords:
     * Use longest common subsequence (LCS) to find structural similarity
     * Consider word-level semantic similarity
     * For single words, look for:
       - Synonyms
       - Related concepts
       - Task-relevant terms
     * Include candidates with high semantic relevance

4. Fallback Matching (if no matches found):
   - Analyze the goals text to identify key actions or intents
   - Look for task-related keywords in the goals that could map to MCP services
   - Consider the overall context and purpose of the step
   - Select the most relevant candidate keywords based on the broader context
   - Never return an empty array for any step

5. Selection Criteria:
   - Each step can return multiple matching keywords
   - All returned keywords must be from CANDIDATE_KEYWORDS
   - For each step:
     * Include all keywords that meet the matching criteria
     * Order keywords by match quality (best matches first)
     * Prefer shorter keywords over longer ones
     * Prefer more specific keywords over general ones
     * Prefer standard format keywords over non-standard ones
   - If no direct matches are found, use fallback matching to ensure at least one keyword is returned

IMPORTANT OUTPUT REQUIREMENTS:
1. Return ONLY the JSON array, nothing else
2. Do not include any explanations, comments, or additional text
3. Do not include "Final Answer:" or similar prefixes
4. The response must be a valid JSON array that can be parsed directly
5. The array length MUST match the number of steps exactly
6. Each step MUST have at least one matching keyword
7. Example of valid output format:
[
  ["match_keyword1_for_step_0", "match_keyword2_for_step_0"],
  ["match_keyword1_for_step_1", "match_keyword2_for_step_1"],
  ["match_keyword1_for_step_2"]
]

Input ($0 - Goals):
#GOALS#

Input ($1 - Intent Steps):
#INTENT_STEPS#

Input ($2 - Candidate MCP Keywords):
#CANDIDATE_KEYWORDS#`
};

/**
 * Creates a matcher prompt for matching intent keywords to MCP keywords
 * @param intentSteps - The step-based intent keyword structure
 * @param candidateKeywords - The list of candidate MCP keywords
 * @returns The matcher prompt with the input data inserted
 */
export const createMatcherForKeywords = (
  goals: string,
  intentSteps: Array<{ step: number; keywords: string[] }>,
  candidateKeywords: string[]
): string => {
  return realtimeKeywordsMappingPrompts.matcher_template
    .replace('#GOALS#', goals)
    .replace('#INTENT_STEPS#', JSON.stringify(intentSteps, null, 2))
    .replace('#CANDIDATE_KEYWORDS#', JSON.stringify(candidateKeywords, null, 2));
};
