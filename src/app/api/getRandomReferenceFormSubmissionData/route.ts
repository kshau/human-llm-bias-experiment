import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { getRandomArrayItem } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { bias, block } = await request.json();

        if (!(["2", "3"].includes(block))) {
            return NextResponse.json({ referenceFormSubmissionID: null, referenceFormSubmissionChoseToHitOptionsSet: null }, { status: 200 });
        }

        let referenceFormSubmissionDoc;
        
        if (block == "2") {
            referenceFormSubmissionDoc = await FormSubmission.findOne({ bias, block: "1" });
            console.log(referenceFormSubmissionDoc);
        }

        else {

            const formSubmissionCandidateDocs = await FormSubmission.find({ bias, block: block == "2" ? "1" : "2", isReferenced: false });

            if (formSubmissionCandidateDocs.length <= 0) {
                return NextResponse.json({ referenceFormSubmissionID: null, referenceFormSubmissionChoseToHitOptionsSet: null }, { status: 200 });
            }

            referenceFormSubmissionDoc = getRandomArrayItem(formSubmissionCandidateDocs);

        }

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