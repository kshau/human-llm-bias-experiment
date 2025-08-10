import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { getRandomArrayItem, LLMConversationSummaryData } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { referenceFormSubmissionID } = await request.json();

        const referenceFormSubmissionDoc = await FormSubmission.findOne({ id: referenceFormSubmissionID });

        if (!referenceFormSubmissionDoc) {
            return NextResponse.json({ referenceLLMConversationSummaryData: null }, { status: 200 });
        }

        let summarizeReferenceLLMConversationBy;

        if (referenceFormSubmissionDoc.block == "1") {

            summarizeReferenceLLMConversationBy = getRandomArrayItem(["user", "model"]);

        }

        else {
            const block1FormSubmissionDoc = await FormSubmission.findOne({ id: referenceFormSubmissionDoc.referenceFormSubmissionID });
            summarizeReferenceLLMConversationBy = block1FormSubmissionDoc.llmConversationSummarizedBy;
        }

        referenceFormSubmissionDoc.llmConversationSummarizedBy = summarizeReferenceLLMConversationBy;
        await referenceFormSubmissionDoc.save();

        const selectedFormSubmissionLLMConversationMessages = referenceFormSubmissionDoc.llmConversationMessages.value;

        if (summarizeReferenceLLMConversationBy == "user") {

            const userLLMConversationSummary = selectedFormSubmissionLLMConversationMessages[selectedFormSubmissionLLMConversationMessages.length - 2].content

            return NextResponse.json({ referenceLLMConversationSummaryData: {
                content: userLLMConversationSummary, 
                by: summarizeReferenceLLMConversationBy
            } as LLMConversationSummaryData, referenceFormSubmissionID: referenceFormSubmissionDoc.id }, { status: 200 });

        }

        else {

            selectedFormSubmissionLLMConversationMessages.splice(-3);

            return NextResponse.json({ referenceLLMConversationSummaryData: {
                content: referenceFormSubmissionDoc.modelLLMConversationSummary, 
                by: summarizeReferenceLLMConversationBy
            } as LLMConversationSummaryData, referenceFormSubmissionID: referenceFormSubmissionDoc.id }, { status: 200 });

        }

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}