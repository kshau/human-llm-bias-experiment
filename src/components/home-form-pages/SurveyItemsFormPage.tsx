"use client";;
import { Button } from "@/components/ui/button"

import { HomeFormPageProps, SurveyItem, SurveyItems } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChevronRight } from "lucide-react"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { BackgroundGradient } from "../ui/background-gradient";

export function SurveyItemsFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

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
    propensityToTrust: [
      "Generally, I would trust AI.",
      "AI can help me solve many problems.",
      "I think it is a good idea to rely on AI for help.",
      "I wouldn't trust the information I get from AI.",
      "AI is reliable.",
      "I would rely on AI."
    ]
  }

  const [surveyItems, setSurveyItems] = useState<SurveyItems>({
    personality: surveyItemQuestions.personality.map(question => ({
      question, 
      agreementLevel: null
    })), 
    individualismCollectivismScale: surveyItemQuestions.individualismCollectivismScale.map(question => ({
      question, 
      agreementLevel: null
    })), 
    propensityToTrust: surveyItemQuestions.propensityToTrust.map(question => ({
      question, 
      agreementLevel: null
    })),
  })

  useEffect(() => {

    const newInvalidAgreementLevel = !([4, null].includes(surveyItems.personality[4].agreementLevel));

    setInvalidAgreementLevel(newInvalidAgreementLevel);

    setUserCanMoveToNextPage(
      !Object.values(surveyItems).some(category =>
        (category as SurveyItem[]).some((item: SurveyItem) => item.agreementLevel == null)
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
                    <SurveyItemsFormPageTable surveyItems={surveyItems} setSurveyItems={setSurveyItems} surveyItemsCategory="personality"/>
                    {invalidAgreementLevel ? (
                      <span className="text-sm text-destructive">Please read the questions carefully.</span>
                    ) : <></>}
                  </div>
                  <div>
                    <SurveyItemsFormPageTable surveyItems={surveyItems} setSurveyItems={setSurveyItems} surveyItemsCategory="individualismCollectivismScale"/>
                  </div>
                  <div>
                    <SurveyItemsFormPageTable surveyItems={surveyItems} setSurveyItems={setSurveyItems} surveyItemsCategory="propensityToTrust"/>
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

interface SurveyItemsFormPageTableProps {
  surveyItems: SurveyItems
  setSurveyItems: Dispatch<SetStateAction<SurveyItems>>, 
  surveyItemsCategory: keyof SurveyItems
}

function SurveyItemsFormPageTable({ surveyItems, setSurveyItems, surveyItemsCategory } : SurveyItemsFormPageTableProps) {

  const agreementLevelLabels = [
    "Strongly disagree", 
    "Somewhat disagree", 
    "Neither agree nor disagree", 
    "Somewhat agree", 
    "Strongly agree"
  ]

  return (
    <Table>
      <TableHeader>
          <TableRow>
            <TableHead/>
            <TableHead className="w-[48rem]">
              <div className="flex flex-row justify-between space-x-4">
                {agreementLevelLabels.map((label, index) => (
                  <span key={index}>{label}</span>
                ))}
              </div>
              
            </TableHead>
          </TableRow>
      </TableHeader>
      <TableBody>
        {surveyItems[surveyItemsCategory].map((item: SurveyItem, index: number) => (
          <TableRow key={index}>
            <TableCell className="max-w-40">
              <span className="whitespace-normal break-words">
                {item.question}
              </span>
            </TableCell>
            <TableCell>
              <RadioGroup className="flex flex-row justify-between px-10" onValueChange={value => {

                const newSurveyItemsInCategory = surveyItems[surveyItemsCategory];

                for (const itemIndex in newSurveyItemsInCategory) {
                  if (newSurveyItemsInCategory[itemIndex].question == item.question) {
                    newSurveyItemsInCategory[itemIndex].agreementLevel = parseInt(value);
                  }
                }
                
                setSurveyItems(o => ({
                  ...o, 
                  [surveyItemsCategory]: newSurveyItemsInCategory
                }))
              }}>
                {[1, 2, 3, 4, 5].map((agreementLevel, index) => (
                  <RadioGroupItem value={agreementLevel.toString()} key={index} className="w-6 h-6"/>
                ))}
              </RadioGroup>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
  )

}