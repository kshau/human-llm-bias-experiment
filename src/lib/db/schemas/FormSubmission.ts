import mongoose, { Schema } from "mongoose";

const formSubmissionSchema = new Schema({
    bias: { type: String, required: true },
    block: { type: String, required: true },
    demographics: { type: Object, required: true },
    survey: { type: Object, required: true },
    preDiscussionChoseToHit: { type: Object, required: true }, 
    preDiscussionConfidence: { type: Object, required: true }, 
    llmConversationMessages: { type: Object, required: true }, 
    postDiscussionChoseToHit: { type: Object, required: true }, 
    postDiscussionConfidence: { type: Object, required: true }, 
    llmConversationSummarizedBy: { type: Array<string>, default: [] }
});

const FormSubmission = mongoose.models.formSubmission || mongoose.model('formSubmission', formSubmissionSchema);
export default FormSubmission;