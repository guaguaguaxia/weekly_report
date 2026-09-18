import assert from "node:assert/strict";
import test from "node:test";
import { createParser } from "eventsource-parser";
import { extractDeltaText } from "./extractDeltaText.ts";

function accumulateSse(sseBody: string): string {
  let out = "";
  const parser = createParser((event: any) => {
    if (event.type !== "event" || event.data === "[DONE]") {
      return;
    }
    out += extractDeltaText(JSON.parse(event.data));
  });
  parser.feed(sseBody);
  return out;
}

function unsafeExtract(json: any): string {
  return json.choices[0].delta?.content || "";
}

const userReasoningChunk = {
  id: "2da32b16-6fdc-4662-aa33-ac92ddab3711",
  object: "chat.completion.chunk",
  created: 1789714581,
  model: "deepseek-flash",
  system_fingerprint: "aeb56401ca74e127821c4f9126dcb669",
  choices: [
    {
      index: 0,
      delta: { content: null, reasoning_content: "可以" },
      logprobs: null,
      finish_reason: null,
    },
  ],
};

test("ignores DeepSeek reasoning tokens so they are not rendered as markdown", () => {
  assert.equal(extractDeltaText(userReasoningChunk), "");
});

test("forwards the final answer content that should be rendered as markdown", () => {
  const chunk = {
    choices: [{ delta: { content: "## 本周工作\n- 完成接口联调" } }],
  };
  assert.equal(extractDeltaText(chunk), "## 本周工作\n- 完成接口联调");
});

test("does not throw when a usage/finish chunk has empty choices (old parser killed the stream)", () => {
  const emptyChoices = { choices: [] };
  assert.throws(() => unsafeExtract(emptyChoices), TypeError);
  assert.equal(extractDeltaText(emptyChoices), "");
});

test("accumulating only reasoning chunks leaves the markdown body empty", () => {
  const reasoningChunks = [
    userReasoningChunk,
    {
      ...userReasoningChunk,
      choices: [
        {
          index: 0,
          delta: { content: null, reasoning_content: "少一点" },
          logprobs: null,
          finish_reason: null,
        },
      ],
    },
    {
      choices: [{ delta: { content: null }, finish_reason: "length" }],
    },
  ];

  const accumulated = reasoningChunks.map(extractDeltaText).join("");
  assert.equal(accumulated, "");
});

test("SSE stream of the user's reasoning chunks does not produce markdown", () => {
  const sse = [
    `data: ${JSON.stringify(userReasoningChunk)}`,
    `data: ${JSON.stringify({
      choices: [{ delta: { content: null, reasoning_content: "完整周报" } }],
    })}`,
    "data: [DONE]",
  ].join("\n\n");

  assert.equal(accumulateSse(sse), "");
});

test("SSE stream with answer content produces markdown for the UI", () => {
  const sse = [
    `data: ${JSON.stringify(userReasoningChunk)}`,
    `data: ${JSON.stringify({
      choices: [{ delta: { content: "## 本周工作\n" } }],
    })}`,
    `data: ${JSON.stringify({
      choices: [{ delta: { content: "- 完成接口联调" } }],
    })}`,
    "data: [DONE]",
  ].join("\n\n");

  assert.equal(accumulateSse(sse), "## 本周工作\n- 完成接口联调");
});
