import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { getRandomArrayItem } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { bias, block } = await request.json();
        
        const formSubmissionCandidateDocs = await FormSubmission.find({ bias, block });

        if (formSubmissionCandidateDocs.length <= 0) {
            return NextResponse.json({ userLLMConversationSummary: null }, { status: 200 });
        }

        const selectedFormSubmissionDoc = getRandomArrayItem(formSubmissionCandidateDocs);

        return NextResponse.json({ userLLMConversationSummary: selectedFormSubmissionDoc.userLLMConversationSummary.value }, { status: 200 });

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}