"use client"

import { LLMConversationFormPage } from "@/components/home-form-pages/LLMConversationFormPage";
import { PostDiscussionSurveyFormPage } from "@/components/home-form-pages/PostDiscussionSurveyFormPage";
import { ChoseToHitFormPage } from "@/components/home-form-pages/ChoseToHitFormPage"
import { Block, getRandomArrayItem, UserFormData } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react"
import { notFound, useParams } from 'next/navigation';
import { WelcomeFormPage } from "@/components/home-form-pages/WelcomeFormPage";
import { DemographicsFormPage } from "@/components/home-form-pages/DemographicsFormPage";
import { SurveyItemsFormPage } from "@/components/home-form-pages/SurveyItemsFormPage";


export default function Home() {

  const params = useParams();

  if (!(["1", "2", "3"].includes(params.block as Block))) {
    notFound();
  }

  const [currentFormPageIndex, setCurrentFormPageIndex] = useState<number>(4);
  const [shouldSubmitForm, setShouldSubmitForm] = useState<boolean>(false);

  const [userFormData, setUserFormData] = useState<UserFormData>({
    bias: getRandomArrayItem(["neutral", "utilitarian", "deontological"]),
    block: params.block as Block,
    demographics: null,
    choseToHit: null, 
    preDiscussionConfidence: null, 
    llmConversationMessages: null, 
    postDiscussionConfidence: null
  });

  const goToNextFormPage = (shouldSubmitFormParam?: boolean) => {
    setShouldSubmitForm(shouldSubmitFormParam || false);
    setCurrentFormPageIndex(o => o + 1);
  }

  const formPages = [
    <WelcomeFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} key="welcome"/>,
    <DemographicsFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} key="demographics"/>,
    <SurveyItemsFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} key="survey"/>,
    <ChoseToHitFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} key="choseToHit"/>, 
    <LLMConversationFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} bias={userFormData.bias} block={userFormData.block} key="llmConversation"/>, 
    <PostDiscussionSurveyFormPage goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData} key="postDiscussionSurvey"/>
  ]

  const submitUserFormData = async () => {
    await axios.post("/api/submitUserFormData", { userFormData });
  }

  useEffect(() => {
    if (shouldSubmitForm) {
      submitUserFormData();
    }
  }, [shouldSubmitForm]);

  useEffect(() => {
    console.log(userFormData.bias);
  }, [])

  return (

    <div className="my-16 flex justify-center">
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