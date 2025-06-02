import { LLMConversationMessage } from "@/lib/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const {GOOGLE_GEMINI_API_KEY} = process.env;

async function respondToLLMConversation(conversation: Array<LLMConversationMessage>) {

  const formattedMessages = conversation.map((message: LLMConversationMessage) => ({
    role: message.from,
    parts: [{ text: message.content }],
  }));

  const res = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    { contents: formattedMessages },
    {
      params: {
        key: GOOGLE_GEMINI_API_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const { candidates } = res.data;
  return candidates[0].content.parts[0].text;

}


export async function POST(request: NextRequest) {

    try {

        const { conversation } = await request.json();
        
        const responseFromLLM = await respondToLLMConversation(conversation);

        return NextResponse.json({ responseFromLLM }, { status: 200 });

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}