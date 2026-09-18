/**
 * Pull the user-visible answer token from a DeepSeek/OpenAI chat.completion.chunk.
 * Thinking models put chain-of-thought in `delta.reasoning_content` with `content: null`;
 * that must not be treated as the weekly-report markdown.
 */
export function extractDeltaText(json: unknown): string {
  if (!json || typeof json !== "object") {
    return "";
  }

  const choices = (json as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return "";
  }

  const content = choices[0]?.delta?.content;
  return typeof content === "string" ? content : "";
}
