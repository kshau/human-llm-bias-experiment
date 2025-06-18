import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { getRandomArrayItem, LLMConversationSummaryData, promptGemini } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { bias, block } = await request.json();
        
        const formSubmissionCandidateDocs = await FormSubmission.find({ bias, block, llmConversationSummarizedBy: { $size: 0 } });

        if (formSubmissionCandidateDocs.length <= 0) {
            return NextResponse.json({ llmConversationSummaryData: null }, { status: 200 });
        }

        const summarizeLLMConversationBy = getRandomArrayItem(["user", "model"]);

        const selectedFormSubmissionDoc = getRandomArrayItem(formSubmissionCandidateDocs);
        selectedFormSubmissionDoc.llmConversationSummarizedBy.push(summarizeLLMConversationBy);
        await selectedFormSubmissionDoc.save();

        const selectedFormSubmissionLLMConversationMessages = selectedFormSubmissionDoc.llmConversationMessages.value;

        if (summarizeLLMConversationBy == "user") {

            const userLLMConversationSummary = selectedFormSubmissionLLMConversationMessages[selectedFormSubmissionLLMConversationMessages.length - 2].content

            return NextResponse.json({ llmConversationSummaryData: {
                content: userLLMConversationSummary, 
                by: summarizeLLMConversationBy
            } as LLMConversationSummaryData }, { status: 200 });

        }

        else {

            selectedFormSubmissionLLMConversationMessages.splice(-3);

            const modelLLMConversationSummary = await promptGemini([
                {
                    role: "user", 
                    parts: [{ text: `

                        SUMMARIZE THE CONVERSATION BETWEEN BELOW.
                        RETURN ONLY THE SUMMARY.

                        ${JSON.stringify(selectedFormSubmissionLLMConversationMessages)}

                    ` }]
                }
            ])

            return NextResponse.json({ llmConversationSummaryData: {
                content: modelLLMConversationSummary, 
                by: summarizeLLMConversationBy
            } as LLMConversationSummaryData }, { status: 200 });

        }

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}