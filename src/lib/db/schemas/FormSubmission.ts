import mongoose, { Schema } from "mongoose";

const formSubmissionSchema = new Schema({
    id: { type: String, required: true },
    bias: { type: String, required: true },
    block: { type: String, required: true },
    demographics: { type: Object, required: true },
    survey: { type: Object, required: true },
    preDiscussionChoseToHit: { type: Object, required: true }, 
    preDiscussionConfidence: { type: Object, required: true }, 
    llmConversationMessages: { type: Object, required: true }, 
    postDiscussionChoseToHit: { type: Object, required: true }, 
    postDiscussionConfidence: { type: Object, required: true }, 
    modelLLMConversationSummary: { type: String, required: true },
    llmConversationSummarizedBy: { type: Array<string>, default: [] }, 
    recievedSummaryFormSubmissionID: { type: String, default: null }
});

const FormSubmission = mongoose.models.formSubmission || mongoose.model('formSubmission', formSubmissionSchema);
export default FormSubmission;