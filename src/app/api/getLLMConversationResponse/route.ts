import { LLMConversationMessage } from "@/lib/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const {GOOGLE_GEMINI_API_KEY} = process.env;

async function getLLMConversationResponse(llmConversationMessages: Array<LLMConversationMessage>) {

  const formattedLLMConversationMessages = llmConversationMessages.map((message: LLMConversationMessage) => ({
    role: message.from,
    parts: [{ text: message.content }],
  }));

  const res = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    { contents: formattedLLMConversationMessages },
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

        const { llmConversationMessages } = await request.json();

        let llmConversationResponse;
        let endLLMConversation = false;

        if (llmConversationMessages.length >= 13) {
          llmConversationResponse = "Thank you! You can now move to the next page.";
          endLLMConversation = true;
        }

        else if (llmConversationMessages.length >= 11) {
          llmConversationResponse = "Please summarize the conversation we just had.";
        }

        else {
          llmConversationResponse = await getLLMConversationResponse(llmConversationMessages);
        }

        return NextResponse.json({ llmConversationResponse, endLLMConversation }, { status: 200 });

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}