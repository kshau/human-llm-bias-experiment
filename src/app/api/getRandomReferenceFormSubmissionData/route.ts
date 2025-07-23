import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { getRandomArrayItem } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { bias, block } = await request.json();

        if (!(["2", "3"].includes(block))) {
            return NextResponse.json({ referenceFormSubmissionID: null, referenceFormSubmissionChoseToHitOptionsSet: null }, { status: 200 });
        }

        let formSubmissionCandidateDocs = [];

        switch (block) {
            case "2":
                formSubmissionCandidateDocs = await FormSubmission.find({ bias, block: "1", isReferenced: false });
                break;
            case "3":
                formSubmissionCandidateDocs = await FormSubmission.find({ bias, block: "2", isReferenced: false, llmConversationSummarizedBy: { $size: 1 } });
                break;
        }

        if (formSubmissionCandidateDocs.length <= 0) {
            return NextResponse.json({ referenceFormSubmissionID: null, referenceFormSubmissionChoseToHitOptionsSet: null }, { status: 200 });
        }

        const referenceFormSubmissionDoc = getRandomArrayItem(formSubmissionCandidateDocs);

        referenceFormSubmissionDoc.isReferenced = true;
        await referenceFormSubmissionDoc.save();

        return NextResponse.json({ 
            referenceFormSubmissionID: referenceFormSubmissionDoc.id, 
            referenceFormSubmissionChoseToHitOptionsSet: referenceFormSubmissionDoc.choseToHitOptionsSet 
        }, { status: 200 });

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}