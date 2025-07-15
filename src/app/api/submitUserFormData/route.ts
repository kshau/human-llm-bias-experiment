import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { promptGemini } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from 'nanoid';


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

        const formSubmissionDoc = new FormSubmission({ id: nanoid(8), ...userFormData, modelLLMConversationSummary });
        await formSubmissionDoc.save();

        return NextResponse.json({}, { status: 200 });

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}