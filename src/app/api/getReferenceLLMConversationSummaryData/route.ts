import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { getRandomArrayItem, LLMConversationSummaryData } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { referenceFormSubmissionID } = await request.json();

        const referenceFormSubmissionDoc = await FormSubmission.findOne({ id: referenceFormSubmissionID });;
        let summarizeReferenceLLMConversationBy;

        if (!referenceFormSubmissionDoc) {
            return NextResponse.json({ referenceLLMConversationSummaryData: null }, { status: 200 });
        }

        switch (referenceFormSubmissionDoc.block) {

            case "1":
                summarizeReferenceLLMConversationBy = getRandomArrayItem(["user", "model"]);
                break;
            case "2":
                summarizeReferenceLLMConversationBy = referenceFormSubmissionDoc.llmConversationSummarizedBy[0] == "user" ? "model" : "user";
                break;

        }

        referenceFormSubmissionDoc.llmConversationSummarizedBy.push(summarizeReferenceLLMConversationBy);
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