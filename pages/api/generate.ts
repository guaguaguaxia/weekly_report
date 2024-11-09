import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (process.env.NEXT_PUBLIC_USE_USER_KEY !== "true") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  var { prompt, api_key } = (await req.json()) as {
    prompt?: string;
    api_key?: string
  };
  //todo make this variable into messages
  var p = "作为一名小红书文案创作种草达人，你需要具备高水准的文案写作技巧、对年轻用户心理的敏锐洞察力，以及强烈的市场敏感度。主要职责包括：根据小红书平台的特点撰写极具“种草”效果的内容，运用爆款关键词、热门话题、以及小红书独特的符号，如“✨”“❤️”“📌”等，让用户一眼就被吸引。你还应熟练使用适合小红书的文案结构，如分段讲解、符号列表和问答互动风格，以便内容更易阅读，提升用户参与度和互动率。保持亲切自然的语气，分享真实的体验和实用的建议，帮助用户在轻松愉快的阅读中了解产品或内容。"
  prompt = p + prompt
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  // if (!process.env.OPENAI_MODEL) {
  //   throw new Error("Missing env var from OpenAI")
  // }

  const payload: OpenAIStreamPayload = {
    model: "moonshot-v1-8k",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
    api_key,
  }

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
