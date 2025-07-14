import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { promptGemini } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {

        const { userFormData } = await request.json();

        const modelLLMConversationSummary = await promptGemini([
            {
                role: "user", 
                parts: [{ text: `
        
                    SUMMARIZE THE CONVERSATION BETWEEN BELOW.
                    RETURN ONLY THE SUMMARY.
        
                    ${JSON.stringify(userFormData.llmConversationMessages)}
        
                ` }]
            }
        ])

        const formSubmissionDoc = new FormSubmission({ ...userFormData, modelLLMConversationSummary });
        await formSubmissionDoc.save();

        return NextResponse.json({}, { status: 200 });

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}