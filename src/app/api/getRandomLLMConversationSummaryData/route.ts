import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { getRandomArrayItem, LLMConversationSummaryData } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { bias, block } = await request.json();

        let formSubmissionCandidateDocs;

        let summarizeLLMConversationBy;
        let selectedFormSubmissionDoc;

        switch (block) {

            case "2":

                formSubmissionCandidateDocs = await FormSubmission.find({ bias, block: "1", llmConversationSummarizedBy: { $size: 0 } });

                if (formSubmissionCandidateDocs.length <= 0) {
                    break;
                }

                selectedFormSubmissionDoc = getRandomArrayItem(formSubmissionCandidateDocs);
                summarizeLLMConversationBy = getRandomArrayItem(["user", "model"]);

                break;


            case "3":

                formSubmissionCandidateDocs = await FormSubmission.find({ bias, block: "1", llmConversationSummarizedBy: { $size: 1 } });

                if (formSubmissionCandidateDocs.length <= 0) {
                    break;
                }

                selectedFormSubmissionDoc = getRandomArrayItem(formSubmissionCandidateDocs);
                summarizeLLMConversationBy = selectedFormSubmissionDoc.llmConversationSummarizedBy[0] == "user" ? "model" : "user";

                break;

        }


        if (!formSubmissionCandidateDocs || formSubmissionCandidateDocs.length <= 0) {
            return NextResponse.json({ llmConversationSummaryData: null }, { status: 200 });
        }

        selectedFormSubmissionDoc.llmConversationSummarizedBy.push(summarizeLLMConversationBy);
        await selectedFormSubmissionDoc.save();

        const selectedFormSubmissionLLMConversationMessages = selectedFormSubmissionDoc.llmConversationMessages.value;

        if (summarizeLLMConversationBy == "user") {

            const userLLMConversationSummary = selectedFormSubmissionLLMConversationMessages[selectedFormSubmissionLLMConversationMessages.length - 2].content

            return NextResponse.json({ llmConversationSummaryData: {
                content: userLLMConversationSummary, 
                by: summarizeLLMConversationBy
            } as LLMConversationSummaryData, llmConversationFormSubmissionID: selectedFormSubmissionDoc.id }, { status: 200 });

        }

        else {

            selectedFormSubmissionLLMConversationMessages.splice(-3);

            return NextResponse.json({ llmConversationSummaryData: {
                content: selectedFormSubmissionDoc.modelLLMConversationSummary, 
                by: summarizeLLMConversationBy
            } as LLMConversationSummaryData, llmConversationFormSubmissionID: selectedFormSubmissionDoc.id }, { status: 200 });

        }

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}