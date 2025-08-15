import FormSubmission from "@/lib/db/schemas/FormSubmission";
import { demographicsChoices, promptGemini, surveyItemQuestions, UserFormData, validateLLMConversationMessageLengths } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from 'nanoid';

const { PROLIFIC_CC } = process.env;

function validateUserFormData(userFormData: UserFormData): { valid: boolean; errors: string[] } {

	const errors: string[] = [];

	if (!["neutral", "utilitarian", "deontological"].includes(userFormData.bias)) {
		errors.push("Invalid bias");
	}

	if (!["1", "2", "3"].includes(userFormData.block)) {
		errors.push("Invalid block");
	}

	if (userFormData.demographics) {
		const demographics = userFormData.demographics.value;
		if (!demographics.age || demographics.age < 18 || demographics.age > 65) errors.push("Invalid age");
		if (!demographics.gender || !demographicsChoices.genders.map(gender => gender.value).includes(demographics.gender)) errors.push("Invalid gender");
		if (!Array.isArray(demographics.races) || demographics.races.length == 0) errors.push("Invalid races");
		if (!demographics.highestEducationLevel || !demographicsChoices.highestEducationLevels.map(highestEducationLevel => highestEducationLevel.value).includes(demographics.highestEducationLevel)) errors.push("Invalid highestEducationLevel");
		if (!demographics.country || !demographicsChoices.countries.map(country => country.value).includes(demographics.country)) errors.push("Invalid country");
		if (demographics.country == "US" && (!demographics.usStateOrTerritory || !demographicsChoices.usStatesAndTerritories.map(usStateOrTerritory => usStateOrTerritory.value).includes(demographics.usStateOrTerritory))) {
			errors.push("Invalid usStateOrTerritory");
		}
	}

	if (userFormData.survey) {
		if (userFormData.survey && userFormData.survey.value) {

			const survey = userFormData.survey.value as Record<keyof typeof surveyItemQuestions, object>;

			for (const item of Object.keys(surveyItemQuestions) as (keyof typeof surveyItemQuestions)[]) {

				if (item == "miscQuestions") {
					continue;
				}

				const expectedQuestions = surveyItemQuestions[item];
				const userItem = survey[item];

				if (!Array.isArray(userItem)) {
					errors.push(`Survey item '${item}' is missing or not an array`);
					continue;
				}

				// Check length
				if (userItem.length != expectedQuestions.length) {
					errors.push(`Survey item '${item}' has incorrect number of items`);
					continue;
				}

				for (let index = 0; index < expectedQuestions.length; index++) {

					const userQuestion = userItem[index];
					const expectedQuestion = expectedQuestions[index];

					if (!userQuestion || userQuestion.question != expectedQuestion) {
						errors.push(`Survey category '${index}' question mismatch at index ${index}`);
					}
					if (
						userQuestion.agreementLevel == null
					) {
						errors.push(`Survey item '${index}' agreementLevel at index ${index} is not an integer`);
					}
				}
			}
		}
	}

	if (!["1", "2", "3"].includes(userFormData.choseToHitOptionsSet)) {
		errors.push("Invalid choseToHitOptionsSet");
	}

	if (!userFormData.preDiscussionChoseToHit?.value.selectedOption || !["barrier", "pedestrians"].includes(userFormData.preDiscussionChoseToHit.value.selectedOption)) {
		errors.push("Invalid preDiscussionChoseToHit.selectedOption");
	}

	if (!userFormData.preDiscussionChoseToHit?.value.confidence || typeof userFormData.preDiscussionChoseToHit.value.confidence != "number") {
		errors.push("Invalid preDiscussionChoseToHit.confidence");
	}

	if (userFormData.llmConversationMessages) {
		const llmConversationMessages = userFormData.llmConversationMessages.value;
		if (!Array.isArray(llmConversationMessages) || llmConversationMessages.length != 14) {
			errors.push("llmConversationMessages is not full length");
		} else {
			llmConversationMessages.forEach((message, index) => {
				if (!["user", "model"].includes(message.from)) {
					errors.push(`llmConversationMessages[${index}].from must be 'user' or 'model'`);
				}
				if (typeof message.content != "string" || message.content.trim() == "") {
					errors.push(`llmConversationMessages[${index}].content must be a non-empty string`);
				}
				if ("visibleToUser" in message && typeof message.visibleToUser != "boolean") {
					errors.push(`llmConversationMessages[${index}].visibleToUser must be a boolean`);
				}

				errors.push(...validateLLMConversationMessageLengths(llmConversationMessages).errors);

			});
		}
	} else {
		errors.push("Missing llmConversationMessages");
	}

	if (!userFormData.postDiscussionChoseToHit?.value.selectedOption || !["barrier", "pedestrians"].includes(userFormData.postDiscussionChoseToHit.value.selectedOption)) {
		errors.push("Invalid postDiscussionChoseToHit.selectedOption");
	}

	if (!userFormData.postDiscussionChoseToHit?.value.confidence || typeof userFormData.postDiscussionChoseToHit.value.confidence != "number") {
		errors.push("Invalid postDiscussionChoseToHit.confidence");
	}

	return { valid: errors.length == 0, errors };
}

export async function POST(request: NextRequest) {

	try {

		const { userFormData } = await request.json();

		const { valid, errors } = validateUserFormData(userFormData);

		if (!valid) {
			return NextResponse.json({ errors }, { status: 400 });
		}

		const modelLLMConversationSummary = await promptGemini([
			{
				role: "user",
				content: [{
					type: "text", text: `
        
                    SUMMARIZE THE CONVERSATION BETWEEN BELOW.
                    RETURN ONLY THE SUMMARY.
        
                    ${JSON.stringify(userFormData.llmConversationMessages)}
        
                ` }]
			}
		])

		let { llmConversationSummarizedBy } = userFormData;

		if (userFormData.block == "3") {
			const referenceFormSubmissionDoc = await FormSubmission.findOne({ id: userFormData.referenceFormSubmissionID });
			llmConversationSummarizedBy = referenceFormSubmissionDoc.llmConversationSummarizedBy;
		}

		const formSubmissionDoc = new FormSubmission({ id: nanoid(8), ...userFormData, modelLLMConversationSummary, llmConversationSummarizedBy });
		await formSubmissionDoc.save();

		return NextResponse.json({ prolificCC: PROLIFIC_CC }, { status: 200 });

	}

	catch (err: unknown) {
		console.error(err);
		return NextResponse.json({}, { status: 500 });
	}

}