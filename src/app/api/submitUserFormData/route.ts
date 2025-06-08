import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {

        const { userFormData } = await request.json();

        const formSubmissionDoc = new FormSubmission({ ...userFormData });
        await formSubmissionDoc.save();

        return NextResponse.json({}, { status: 200 });

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}