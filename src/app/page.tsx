"use client"

import { LLMConversationFormPage } from "@/components/home-form-pages/LLMConversationFormPage";
import { PostDiscussionSurveyFormPage } from "@/components/home-form-pages/PostDiscussionSurveyFormPage";
import { PreDiscussionSurveyFormPage } from "@/components/home-form-pages/PreDiscussionSurveyPage";
import { SituationPickerFormPage } from "@/components/home-form-pages/SituationPickerFormPage"
import { SummaryFormPage } from "@/components/home-form-pages/SummaryFormPage";
import { UserFormData } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react"

export default function Home() {

  const [currentFormPageIndex, setCurrentFormPageIndex] = useState<number>(0);
  const [shouldSubmitForm, setShouldSubmitForm] = useState<boolean>(false);

  const [userFormData, setUserFormData] = useState<UserFormData>({
    bias: (["neutral", "utilitarian", "deontological"] as const)[Math.floor(Math.random() * 3)],
    choseToHit: null, 
    preDiscussionConfidence: null, 
    conversationWithLLM: null, 
    conversationWithLLMSummary: null, 
    postDiscussionConfidence: null
  });

  const goToNextFormPage = (shouldSubmitFormParam?: boolean) => {
    setShouldSubmitForm(shouldSubmitFormParam || false);
    setCurrentFormPageIndex(o => o + 1);
  }

  const formPages = [
    <SituationPickerFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} key="situationPicker"/>, 
    <PreDiscussionSurveyFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} key="preDiscussionSurvey"/>,
    <LLMConversationFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} bias={userFormData.bias} key="llmConversation"/>, 
    <SummaryFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} key="summary"/>, 
    <PostDiscussionSurveyFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} key="postDiscussionSurvey"/>
  ]

  const submitForm = async () => {
    await axios.post("/api/submitForm", { data: userFormData });
  }

  useEffect(() => {
    if (shouldSubmitForm) {
      submitForm();
    }
  }, [shouldSubmitForm]);

  return (

    <div className="mt-16 flex justify-center">
      {formPages[currentFormPageIndex] || (
        <div className="flex flex-col text-center">
          <span className="font-bold text-6xl">
            Thank you!
          </span>
          <span className="font-thin text-3xl w-[45rem] mt-6">
            Your feedback plays a key role in helping us better understand the topic.
          </span>
        </div>
      )}
    </div>
    
  )

}