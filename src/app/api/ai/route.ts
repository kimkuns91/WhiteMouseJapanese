import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const Example = {
  japanese: [
    { word: "日本", reading: "にほん" },
    { word: "に" },
    { word: "住んで", reading: "すんで" },
    { word: "います" },
    { word: "か" },
    { word: "?" },
  ],
  grammarBreakdown: [
    {
      korean: "일본에 살고 있어요?",
      japanese: [
        { word: "日本", reading: "にほん" },
        { word: "に" },
        { word: "住んで", reading: "すんで" },
        { word: "います" },
        { word: "か" },
        { word: "?" },
      ],
      chunks: [
        {
          japanese: [{ word: "日本", reading: "にほん" }],
          meaning: "Japan",
          grammar: "Noun",
        },
        {
          japanese: [{ word: "に" }],
          meaning: "in",
          grammar: "Particle",
        },
        {
          japanese: [{ word: "住んで", reading: "すんで" }, { word: "います" }],
          meaning: "live",
          grammar: "Verb + て form + います",
        },
        {
          japanese: [{ word: "か" }],
          meaning: "question",
          grammar: "Particle",
        },
        {
          japanese: [{ word: "?" }],
          meaning: "question",
          grammar: "Punctuation",
        },
      ],
    },
  ],
};

export async function GET(request: NextRequest) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a Japanese language teacher. 
Your student asks you how to say something from korean to japanese.
You should respond with: 
- korean: the korean version ex: "일본에 살고 있어요?"
- japanese: the japanese translation in split into words ex: ${JSON.stringify(
          Example.japanese
        )}
- grammarBreakdown: an explanation of the grammar structure per sentence ex: ${JSON.stringify(
          Example.grammarBreakdown
        )}
`,
      },
      {
        role: "system",
        content: `You always respond with a JSON object with the following format: 
        {
          "korean": "",
          "japanese": [{
            "word": "",
            "reading": ""
          }],
          "grammarBreakdown": [{
            "korean": "",
            "japanese": [{
              "word": "",
              "reading": ""
            }],
            "chunks": [{
              "japanese": [{
                "word": "",
                "reading": ""
              }],
              "meaning": "",
              "grammar": ""
            }]
          }]
        }`,
      },
      {
        role: "user",
        content: `How to say ${
          request.nextUrl.searchParams.get("question") ||
          "Have you ever been to Japan?"
        } in Japanese`,
      },
    ],
    model: "gpt-4-1106-preview",
    response_format: {
      type: "json_object",
    },
  });

  return Response.json(JSON.parse(chatCompletion.choices[0].message.content!));
}
