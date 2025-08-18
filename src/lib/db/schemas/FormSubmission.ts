import mongoose, { Schema } from "mongoose";

const formSubmissionSchema = new Schema({
    id: { type: String, required: false },
    bias: { type: String, required: false },
    block: { type: String, required: false },
    prolificID: { type: String, required: false },
    demographics: { type: Object, required: false },
    survey: { type: Object, required: false },
    choseToHitOptionsSet: { type: String, required: false },
    preDiscussionChoseToHit: { type: Object, required: false }, 
    llmConversationMessages: { type: Object, required: false }, 
    postDiscussionChoseToHit: { type: Object, required: false }, 
    modelLLMConversationSummary: { type: String, required: false },
    llmConversationSummarizedBy: { type: String, default: null, required: false }, 
    referenceFormSubmissionID: { type: String, default: null, required: false }, 
    isReferenced: { type: Boolean, default: false, required: false }
});

const FormSubmission = mongoose.models.formSubmission || mongoose.model('formSubmission', formSubmissionSchema);
export default FormSubmission;