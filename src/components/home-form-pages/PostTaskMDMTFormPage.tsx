"use client";;
import { Button } from "@/components/ui/button"

import { HomeFormPageProps, SurveyItem, SurveyItems } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChevronRight } from "lucide-react"
import { useEffect, useState } from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { SurveyItemsTable } from "../SurveyItemsTable";

export function PostTaskMDMTFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

  const [userCanMoveToNextPage, setUserCanMoveToNextPage] = useState<boolean>(false);

  const surveyItemQuestions = {
    postTaskMDMT: [
      "Reliable",
      "Predictable",
      "Dependable",
      "Consistent",
      "Competent",
      "Skilled",
      "Capable",
      "Meticulous",
      "Ethical",
      "Principled",
      "Moral",
      "Has integrity",
      "Transparent",
      "Genuine",
      "Sincere",
      "Candid",
      "Benevolent",
      "Kind",
      "Considerate",
      "Has goodwill"
    ],
  }

  const [surveyItems, setSurveyItems] = useState<SurveyItems>({
    personality: [],
    individualismCollectivismScale: [],
    aiAttitudeScale: [],
    pttForHuman: [],
    pttForAI: [],
    postTaskMDMT: surveyItemQuestions.postTaskMDMT.map(question => ({
      question,
      agreementLevel: null,
      timestamp: null
    })),
  })

  useEffect(() => {

    setUserCanMoveToNextPage(
      !Object.values(surveyItems).some(category =>
        (category as SurveyItem[]).some((surveyItem: SurveyItem) => surveyItem.agreementLevel == null)
      )
    )

  }, [surveyItems])

  return (

    <div className="space-y-2">

      <BackgroundGradient>
        <Card>

            <CardHeader>
                <CardTitle className="text-2xl">
                  Post Task MDMT
                </CardTitle>
                <CardDescription>
                  Please select one for each item.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                  <div>
                    <SurveyItemsTable surveyItems={surveyItems} setSurveyItems={setSurveyItems} surveyItemsCategory="postTaskMDMT" sliderOptions={{slider: true, maxValue: 7, minLabel: "Not at all", maxLabel: "Very much"}}/>
                  </div>
                </div>
                
            </CardContent>

        </Card>

      </BackgroundGradient>

      <Button className="hover:cursor-pointer" onClick={() => {

        setUserFormData(o => ({
            ...o,
            surveyItems: {
              value: {
                personality: o.surveyItems?.value.personality ?? [],
                individualismCollectivismScale: o.surveyItems?.value.individualismCollectivismScale ?? [],
                aiAttitudeScale: o.surveyItems?.value.aiAttitudeScale ?? [],
                pttForHuman: o.surveyItems?.value.pttForHuman ?? [],
                pttForAI: o.surveyItems?.value.pttForAI ?? [],
                postTaskMDMT: surveyItems.postTaskMDMT
              },
              timestamp: Date.now()
            }
        }))

        goToNextFormPage(true);

    }} disabled={!userCanMoveToNextPage}>
        Next
        <ChevronRight/>
      </Button>

    </div>

  )

}

