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
import { ConsentFormPage } from "@/components/home-form-pages/ConsentFormPage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyIcon, Loader2Icon, SquareArrowOutUpRightIcon } from "lucide-react";
import { ProlificIDFormPage } from "@/components/home-form-pages/ProlificIDFormPage";
import { PrimaryTaskIntroFormPage } from "@/components/home-form-pages/PrimaryTaskIntroFormPage";
import { Loading } from "@/components/Loading";
import { toast } from "sonner"


export default function Home() {

  const params = useParams();

  if (!(["1", "2", "3"].includes(params.block as Block))) {
    notFound();
  }

  const [currentFormPageIndex, setCurrentFormPageIndex] = useState<number>(16);
  const [shouldSubmitUserFormData, setShouldSubmitUserFormData] = useState<boolean>(false);
  const [prolificCC, setProlificCC] = useState<string | null>(null);
  
  const [loadingSavedData, setLoadingSavedData] = useState<boolean>(true);

  const [userFormData, setUserFormData] = useState<UserFormData>({
    prolificID: null,
    bias: getRandomArrayItem(["neutral", "utilitarian", "deontological"]),
    block: params.block as Block,
    demographics: null,
    survey: {
      value: {},
      timestamp: null
    },
    choseToHitOptionsSet: getRandomArrayItem(["1", "2", "3"]),
    preDiscussionChoseToHit: null,
    llmConversationMessages: null,
    postDiscussionChoseToHit: null,
    referenceFormSubmissionID: null
  });

  const goToNextFormPage = () => {

    if (currentFormPageIndex >= formPages.length - 1) {
      setShouldSubmitUserFormData(true);
    }

    setCurrentFormPageIndex(o => o + 1);

    localStorage.setItem("userFormData", JSON.stringify(userFormData));
    localStorage.setItem("currentFormPageIndex", JSON.stringify(currentFormPageIndex));

  }

  const submitUserFormData = async () => {

    const res = await axios.post("/api/submitUserFormData", { userFormData });
    setProlificCC(res.data.prolificCC);

    if (res.status == 200) {
      localStorage.clear();
    }

  }

  useEffect(() => {

    console.log(userFormData.bias);

    const savedUserFormDataString = localStorage.getItem("userFormData");
    const savedCurrentFormPageIndexString = localStorage.getItem("currentFormPageIndex");

    if (savedUserFormDataString && savedCurrentFormPageIndexString) {

      const savedUserFormData = JSON.parse(savedUserFormDataString);
      const savedCurrentFormPageIndex = JSON.parse(savedCurrentFormPageIndexString);

      if (savedUserFormData.block != params.block) {
        setLoadingSavedData(false);
        return;
      }

      setUserFormData(savedUserFormData);
      setCurrentFormPageIndex(savedCurrentFormPageIndex);

    }

    setLoadingSavedData(false);

  }, [])

  const formPages = [
    <ConsentFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      key="consent"
    />,
    <ProlificIDFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      key="prolificID"
    />,
    <WelcomeFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      key="welcome"
    />,
    <PrimaryTaskIntroFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      key="primaryTaskIntro"
    />,
    <DemographicsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      userFormData={userFormData}
      key="demographics"
    />,

    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      title="I See Myself As Someone Who"
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
      key="individualismCollectivismScalePreDicussion"
    />,

    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      numberedAgreementLevelLabels={10}
      surveyItemQuestionCategory={{
        name: "aiAttitudeScale",
        questions: surveyItemQuestions.aiAttitudeScale,
      }}
      key="aiAttitudeScalePreDicussion"
    />,

    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      surveyItemQuestionCategory={{
        name: "pttForHuman",
        questions: surveyItemQuestions.pttForHuman,
      }}
      title="This Scale Refers to Your Trust in Humans"
      key="pttForHumanPreDicussion"
    />,

    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      surveyItemQuestionCategory={{
        name: "pttForAI",
        questions: surveyItemQuestions.pttForAI,
      }}
      title="This Scale Refers to Your Trust in AI"
      key="pttForAIPreDicussion"
    />,

    <ChoseToHitFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      userFormDataChoseToHitKey="preDiscussionChoseToHit"
      optionsSet={userFormData.choseToHitOptionsSet}
      key="preDiscussionChoseToHit"
    />,
    <LLMConversationFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      bias={userFormData.bias}
      referenceFormSubmissionID={userFormData.referenceFormSubmissionID}
      choseToHitOptionsSet={userFormData.choseToHitOptionsSet}
      key="llmConversation"
    />,
    <ChoseToHitFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      userFormDataChoseToHitKey="postDiscussionChoseToHit"
      optionsSet={userFormData.choseToHitOptionsSet}
      title="Reselect Your Choice After Your Discussions With LLM Agent"
      key="postDiscussionChoseToHit"
    />,
    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      numberedAgreementLevelLabels={7}
      surveyItemQuestionCategory={{
        name: "postTaskMDMTPart1",
        questions: surveyItemQuestions.postTaskMDMTPart1,
      }}
      title="Please Rate The AI Scale"
      minAgreementLabel="Not at all"
      maxAgreementLabel="Very"
      doesNotFitOption={true}
      key="postTaskMDMTPart1"
    />,
    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      numberedAgreementLevelLabels={7}
      surveyItemQuestionCategory={{
        name: "postTaskMDMTPart2",
        questions: surveyItemQuestions.postTaskMDMTPart2,
      }}
      title="Please Rate The AI Scale"
      minAgreementLabel="Not at all"
      maxAgreementLabel="Very"
      doesNotFitOption={true}
      key="postTaskMDMTPart2"
    />,
    <SurveyItemsFormPage
      goToNextFormPage={goToNextFormPage}
      setUserFormData={setUserFormData}
      numberedAgreementLevelLabels={7}
      surveyItemQuestionCategory={{
        name: "miscQuestions",
        questions: userFormData.block == "1" ? surveyItemQuestions.miscQuestions.slice(0, -1) : surveyItemQuestions.miscQuestions,
      }}
      minAgreementLabel=""
      maxAgreementLabel=""
      key="miscQuestions"
    />,
  ];

  useEffect(() => {
    if (shouldSubmitUserFormData) {
      submitUserFormData();
    }
  }, [shouldSubmitUserFormData, userFormData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentFormPageIndex]);

  const copyUserFormDataToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(userFormData));
    toast("Raw data copied to clipboard!");
  }

  if (loadingSavedData) {
    return <Loading/>
  }

  return (

    <div className="my-16 flex justify-center">

      {formPages[currentFormPageIndex] || (
        <div className="flex flex-col text-center items-center">
          <span className="font-bold text-6xl">
            Thank you!
          </span>
          <span className="font-thin text-3xl w-[45rem] mt-6">
            Your feedback plays a key role in helping us better understand the topic.
          </span>

          <Card className="w-96 mt-12">
            <CardHeader>
              <CardTitle className="text-2xl">
                Return to Prolific
              </CardTitle>
              <CardDescription>
                Click the link below to return to Prolific and recieve your compensation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prolificCC ? (
                <span className="uppercase text-green-500 font-semibold">
                  You can now return to Prolific with the button below
                </span>
              ) : (
                <span className="uppercase text-destructive font-semibold">
                  Do not refresh or leave this page
                </span>
              )}

              <div className="flex flex-col items-center gap-y-2 mt-6">

                <Button
                  variant="outline"
                  disabled={!prolificCC}
                  onClick={() => { window.open(`https://app.prolific.com/submissions/complete?cc=${prolificCC}`) }}
                  className="hover:cursor-pointer w-fit"
                >
                  {prolificCC ? (
                    <SquareArrowOutUpRightIcon />
                  ) : (
                    <Loader2Icon className="animate-spin" />
                  )}
                  Return to Prolific
                </Button>

                <span className="text-muted-foreground">
                  OR
                </span>

                <div className="flex gap-x-2">
                  <span className="font-semibold">
                    Prolific CC:
                  </span>
                  <span>
                    {prolificCC || <Loader2Icon className="animate-spin" />}
                  </span>
                </div>

                <div className="flex flex-col mt-8 gap-y-4">
                  <span>
                    Stuck on loading? Copy the raw data and send it to the study administrator manually.
                  </span>
                  <Button 
                    variant="secondary" 
                    className="w-fit self-center hover:cursor-pointer"
                    onClick={copyUserFormDataToClipboard}
                  >
                    <CopyIcon/>
                    Click to copy
                  </Button>
                </div>

              </div>

            </CardContent>
          </Card>

        </div>
      )}
    </div>

  )

}