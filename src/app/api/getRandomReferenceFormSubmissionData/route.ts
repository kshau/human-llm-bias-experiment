import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { getRandomArrayItem } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { bias, block } = await request.json();

        if (!(["2", "3"].includes(block))) {
            return NextResponse.json({ referenceFormSubmissionID: null, referenceFormSubmissionChoseToHitOptionsSet: null }, { status: 200 });
        }

        // ===================================================================

        let referenceFormSubmissionDoc;
        let referenceFormSubmissionDocId;
        
        if (block == "2") {

            switch (bias) {
                case "utilitarian":
                    referenceFormSubmissionDocId = "6908ed545246ba3da52e79bc";
                    break;
                case "deontological":
                    referenceFormSubmissionDocId = "69026165b0c403395d282cb6";
                    break;
                case "neutral":
                    referenceFormSubmissionDocId = "6909457ee02caee211272083";
                    break;
            }

            referenceFormSubmissionDoc = await FormSubmission.findById(referenceFormSubmissionDocId);

        }

        else {

            const formSubmissionCandidateDocs = await FormSubmission.find({ bias, block: block == "2" ? "1" : "2", isReferenced: false });

            if (formSubmissionCandidateDocs.length <= 0) {
                return NextResponse.json({ referenceFormSubmissionID: null, referenceFormSubmissionChoseToHitOptionsSet: null }, { status: 200 });
            }

            referenceFormSubmissionDoc = getRandomArrayItem(formSubmissionCandidateDocs);

        }

        // =====================================================================================

        // const formSubmissionCandidateDocs = await FormSubmission.find({ bias, block: block == "2" ? "1" : "2", isReferenced: false });

        // if (formSubmissionCandidateDocs.length <= 0) {
        //     return NextResponse.json({ referenceFormSubmissionID: null, referenceFormSubmissionChoseToHitOptionsSet: null }, { status: 200 });
        // }

        // const referenceFormSubmissionDoc = getRandomArrayItem(formSubmissionCandidateDocs);

        // =====================================================================================

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