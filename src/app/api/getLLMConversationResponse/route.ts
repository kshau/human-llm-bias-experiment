import { LLMConversationMessage, promptGemini, validateLLMConversationMessageLengths } from "@/lib/utils";
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
          llmConversationResponse = "To help better train our future LLM model, please reflect and provide a summarization of our conversation and reiterate your thought process on the decision you just made.";
          llmConversationEvent = "summarize";
        }

        else {

          const { valid, errors } = validateLLMConversationMessageLengths(llmConversationMessages);

          if (!valid) {
            return NextResponse.json({ llmConversationResponse: null, llmConversationEvent: null, errors }, { status: 400 });
          }

          const formattedLLMConversationMessages = llmConversationMessages.map((message: LLMConversationMessage) => ({
            role: message.from,
            content: [{ type: "text", text: message.content }],
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