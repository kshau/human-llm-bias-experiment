"use client"

import { LLMConversationFormPage } from "@/components/home-form-pages/LLMConversationFormPage";
import { ChoseToHitFormPage } from "@/components/home-form-pages/dynamic/ChoseToHitFormPage"
import { Block, getRandomArrayItem, surveyItemQuestions, UserFormData } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react"
import { notFound, useParams } from 'next/navigation';
import { WelcomeFormPage } from "@/components/home-form-pages/WelcomeFormPage";
import { DemographicsFormPage } from "@/components/home-form-pages/DemographicsFormPage";
import { SurveyItemsFormPage } from "@/components/home-form-pages/dynamic/SurveyItemsFormPage";


export default function Home() {

  const params = useParams();

  if (!(["1", "2", "3"].includes(params.block as Block))) {
    notFound();
  }

  const [currentFormPageIndex, setCurrentFormPageIndex] = useState<number>(0);
  const [shouldSubmitUserFormData, setShouldSubmitUserFormData] = useState<boolean>(false);

  const [userFormData, setUserFormData] = useState<UserFormData>({
    bias: getRandomArrayItem(["neutral", "utilitarian", "deontological"]),
    block: params.block as Block,
    demographics: null,
    survey: {
      value: {}, 
      timestamp: null
    },
    preDiscussionChoseToHit: null, 
    preDiscussionConfidence: null, 
    llmConversationMessages: null, 
    postDiscussionChoseToHit: null,
    postDiscussionConfidence: null, 
    recievedSummaryFormSubmissionID: null
  });

  const goToNextFormPage = () => {

    if (currentFormPageIndex >= formPages.length - 1) {
      setShouldSubmitUserFormData(true);
    }

    setCurrentFormPageIndex(o => o + 1);

  }

  const submitUserFormData = async () => {
    await axios.post("/api/submitUserFormData", { userFormData });
  }

  const formPages = [

    <WelcomeFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      key="welcome"
    />,

    <DemographicsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      key="demographics"
    />,

    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      title="I see myself as someone who"
      surveyItemQuestionCategory={{
        name: "personality",
        questions: surveyItemQuestions.personality
      }}
      key="personalityPreDicussionFormPage"
    />,

    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      surveyItemQuestionCategory={{
        name: "individualismCollectivismScale",
        questions: surveyItemQuestions.individualismCollectivismScale,
      }}
      key="individualismCollectivismScalePreDicussionFormPage"
    />,

    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      numberedAgreementLevelLabels={10}
      surveyItemQuestionCategory={{
        name: "aiAttitudeScale",
        questions: surveyItemQuestions.aiAttitudeScale,
      }}
      key="aiAttitudeScalePreDicussionFormPage"
    />,

    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      surveyItemQuestionCategory={{
        name: "pttForHuman",
        questions: surveyItemQuestions.pttForHuman,
      }}
      key="pttForHumanPreDicussionFormPage"
    />,

    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      numberedAgreementLevelLabels={7}
      surveyItemQuestionCategory={{
        name: "pttForAI",
        questions: surveyItemQuestions.pttForAI,
      }}
      key="pttForAIPreDicussionFormPage"
    />,

    <ChoseToHitFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      userFormDataChoseToHitKey="preDiscussionChoseToHit"
      userFormDataConfidenceKey="preDiscussionConfidence"
      key="preDiscussionChoseToHit"
    />,
    <LLMConversationFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      bias={userFormData.bias}
      block={userFormData.block}
      key="llmConversation"
    />,
    <ChoseToHitFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      userFormDataChoseToHitKey="postDiscussionChoseToHit"
      userFormDataConfidenceKey="postDiscussionConfidence"
      key="postDiscussionChoseToHit"
    />,
    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      numberedAgreementLevelLabels={7}
      surveyItemQuestionCategory={{
        name: "postTaskMDMT",
        questions: surveyItemQuestions.postTaskMDMT,
      }}
      key="postTaskMDMTFormPage"
    />,
  ];

  useEffect(() => {
    if (shouldSubmitUserFormData) {
      submitUserFormData();
    }
  }, [shouldSubmitUserFormData, userFormData]);

  useEffect(() => {
    console.log(userFormData.bias);
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentFormPageIndex]);

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