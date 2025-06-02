import mongoose, { Schema } from "mongoose";

const formSubmissionSchema = new Schema({
    bias: { type: String, required: true },
    choseToHit: { type: Object, required: true }, 
    preDiscussionConfidence: { type: Object, required: true }, 
    conversationWithLLM: { type: Object, required: true }, 
    conversationWithLLMSummary: { type: Object, required: true }, 
    postDiscussionConfidence: { type: Object, required: true }
});

const FormSubmission = mongoose.models.formSubmission || mongoose.model('formSubmission', formSubmissionSchema);
export default FormSubmission;