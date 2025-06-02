import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {

        const { data } = await request.json();

        console.log(data)

        const formSubmissionDoc = new FormSubmission({ ...data });
        await formSubmissionDoc.save();

        return NextResponse.json({}, { status: 200 });

    }

    catch (err: unknown) {
        console.error(err);
        return NextResponse.json({}, { status: 500 });
    }

}