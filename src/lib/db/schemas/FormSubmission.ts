import mongoose, { Schema } from "mongoose";

const formSubmissionSchema = new Schema({
    bias: { type: String, required: true },
    block: { type: String, required: true },
    demographics: { type: Object, required: true },
    surveyItems: { type: Object, required: true },
    choseToHit: { type: Object, required: true }, 
    preDiscussionConfidence: { type: Object, required: true }, 
    llmConversationMessages: { type: Object, required: true }, 
    postDiscussionConfidence: { type: Object, required: true }
});

const FormSubmission = mongoose.models.formSubmission || mongoose.model('formSubmission', formSubmissionSchema);
export default FormSubmission;