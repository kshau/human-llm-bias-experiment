import { LLMConversationMessage, promptGemini } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {

        const { llmConversationMessages } = await request.json();

        let llmConversationResponse;
        let llmConversationEvent = null;

        if (llmConversationMessages.length >= 13) {
          llmConversationResponse = "Thank you! You can now move to the next page.";
          llmConversationEvent = "end";
        }

        else if (llmConversationMessages.length >= 11) {
          llmConversationResponse = "Please summarize the conversation we just had.";
          llmConversationEvent = "summarize";
        }

        else {

          const formattedLLMConversationMessages = llmConversationMessages.map((message: LLMConversationMessage) => ({
            role: message.from,
            parts: [{ text: message.content }],
          }));

          llmConversationResponse = await promptGemini(formattedLLMConversationMessages);

        }

        return NextResponse.json({ llmConversationResponse, llmConversationEvent }, { status: 200 });

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}