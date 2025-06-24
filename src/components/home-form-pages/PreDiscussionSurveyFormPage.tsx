"use client";;
import { Button } from "@/components/ui/button"

import { HomeFormPageProps, SurveyItem, SurveyItems } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChevronRight } from "lucide-react"
import { useEffect, useState } from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { SurveyItemsTable } from "../SurveyItemsTable";

export function PreDiscussionSurveyFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

  const [userCanMoveToNextPage, setUserCanMoveToNextPage] = useState<boolean>(false);
  const [invalidAgreementLevel, setInvalidAgreementLevel] = useState<boolean>(false);

  const surveyItemQuestions = {
    personality: [
      "Is reserved",
      "Is generally trusting",
      "Tends to be lazy",
      "Is relaxed, handles stress well",
      'Select "Somewhat agree" for this item',
      "Has few artistic interests",
      "Is outgoing, sociable",
      "Tends to find fault with others",
      "Does a thorough job",
      "Gets nervous easily",
      "Has an active imagination"
    ], 
    individualismCollectivismScale: [
      "I prefer to work with others in a group rather than working alone.",
      "Given the choice, I would rather do a job where I can work alone rather than doing a job where I have to work with others.",
      "Working with a group is better than working alone."
    ], 
    aiAttitudeScale: [
      "I believe that AI will improve my life",
      "I believe that AI will improve my work",
      "I think I will use AI technology in the future",
      "I think AI technology is positive for humanity"
    ], 
    pttForHuman: [
      "Even though I may sometimes suffer the consequences of trusting other people, I still prefer to trust than not to trust them.",
      "I feel good about trusting other people.",
      "I believe that I am generally better off when I do not trust other people than when I trust them.",
      "I rarely trust other people because I can't handle the uncertainty.",
      "Other people are competent.",
      "Other people have sound knowledge about problems which they are working on.",
      "I am wary about other people's capabilities.",
      "Other people do not have the capabilities that could help me reach my goals.",
      "I believe that other people have good intentions.",
      "I feel that other people are out to get as much as they can for themselves.",
      "I don't expect that people are willing to assist and support other people.",
      "Most other people are honest.",
      "I feel that other people can be relied upon to do what they say they will do.",
      "One cannot expect to be treated fairly by other people."
    ], 
    pttForAI: [
      "Even though I may sometimes suffer the consequences of trusting automated technological systems, I still prefer to trust than not to trust them.",
      "I feel good about trusting automated technological systems.",
      "I believe that I am generally better off when I do not trust automated technological systems than when I trust them.",
      "I rarely trust automated technological systems because I can't handle the uncertainty.",
      "Automated technological systems are competent.",
      "Automated technological systems have sound knowledge about problems for which they are intended.",
      "I am wary about the capabilities of automated technological systems.",
      "Automated technological systems do not have the capabilities that could help me reach my goals.",
      "I believe that automated technological systems have good intentions.",
      "I feel that automated technological systems are out to get as much as they can for themselves.",
      "I don't expect that automated technological systems are willing to assist and support people.",
      "Most automated technological systems are honest.",
      "I feel that automated technological systems can be relied upon to do what they say they will do.",
      "One cannot expect to be treated fairly by automated technological systems."
    ]
  }

  const [surveyItems, setSurveyItems] = useState<SurveyItems>({
    personality: surveyItemQuestions.personality.map(question => ({
      question, 
      agreementLevel: null, 
      timestamp: null
    })), 
    individualismCollectivismScale: surveyItemQuestions.individualismCollectivismScale.map(question => ({
      question, 
      agreementLevel: null, 
      timestamp: null
    })), 
    aiAttitudeScale: surveyItemQuestions.aiAttitudeScale.map(question => ({
      question, 
      agreementLevel: null, 
      timestamp: null
    })),
    pttForHuman: surveyItemQuestions.pttForHuman.map(question => ({
      question, 
      agreementLevel: null, 
      timestamp: null
    })), 
    pttForAI: surveyItemQuestions.pttForAI.map(question => ({
      question, 
      agreementLevel: null, 
      timestamp: null
    })), 
    postTaskMDMT: []
  })

  useEffect(() => {

    const newInvalidAgreementLevel = !([4, null].includes(surveyItems.personality[4].agreementLevel));

    setInvalidAgreementLevel(newInvalidAgreementLevel);

    setUserCanMoveToNextPage(
      !Object.values(surveyItems).some(category =>
        (category as SurveyItem[]).some((surveyItem: SurveyItem) => surveyItem.agreementLevel == null)
      ) &&
      !newInvalidAgreementLevel
    )

  }, [surveyItems])

  return (

    <div className="space-y-2">

      <BackgroundGradient>
        <Card>

            <CardHeader>
                <CardTitle className="text-2xl">
                  Survey
                </CardTitle>
                <CardDescription>
                  Please select one for each item.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                  <div>
                    <SurveyItemsTable surveyItems={surveyItems} setSurveyItems={setSurveyItems} surveyItemsCategory="personality"/>
                    {invalidAgreementLevel ? (
                      <span className="text-sm text-destructive">Please read the questions carefully.</span>
                    ) : <></>}
                  </div>
                  <div>
                    <SurveyItemsTable surveyItems={surveyItems} setSurveyItems={setSurveyItems} surveyItemsCategory="individualismCollectivismScale"/>
                  </div>
                  <div>
                    <SurveyItemsTable surveyItems={surveyItems} setSurveyItems={setSurveyItems} surveyItemsCategory="aiAttitudeScale" sliderOptions={{slider: true, maxValue: 10, minLabel: "Not at all", maxLabel: "Completely agree"}}/>
                  </div>
                  <div>
                    <SurveyItemsTable surveyItems={surveyItems} setSurveyItems={setSurveyItems} surveyItemsCategory="pttForHuman"/>
                  </div>
                  <div>
                    <SurveyItemsTable surveyItems={surveyItems} setSurveyItems={setSurveyItems} surveyItemsCategory="pttForAI"/>
                  </div>
                </div>
                
            </CardContent>

        </Card>

      </BackgroundGradient>

      <Button className="hover:cursor-pointer" onClick={() => {

        setUserFormData(o => ({
            ...o,
            surveyItems: {
              value: surveyItems, 
              timestamp: Date.now()
            }
        }))

        goToNextFormPage();

    }} disabled={!userCanMoveToNextPage}>
        Next
        <ChevronRight/>
      </Button>

    </div>

  )

}

