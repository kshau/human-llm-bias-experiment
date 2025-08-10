"use client";;
import { SurveyItem, SurveyItemQuestionCategory, UserFormData } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { ChevronRight } from "lucide-react";

interface SurveyItemsFormPageProps {
  goToNextFormPage: CallableFunction,
  setUserFormData: Dispatch<SetStateAction<UserFormData>>,
  surveyItemQuestionCategory: SurveyItemQuestionCategory,
  numberedAgreementLevelLabels?: number,
  minAgreementLabel?: string,
  maxAgreementLabel?: string,
  doesNotFitOption?: boolean
  title?: string
}

export function SurveyItemsFormPage({
  goToNextFormPage,
  setUserFormData,
  surveyItemQuestionCategory,
  numberedAgreementLevelLabels,
  minAgreementLabel = "Not at all",
  maxAgreementLabel = "Completely agree",
  doesNotFitOption = false,
  title
}: SurveyItemsFormPageProps) {

  const [userCanMoveToNextPage, setUserCanMoveToNextPage] = useState<boolean>(false);

  const { questions } = surveyItemQuestionCategory;

  const [surveyItems, setSurveyItems] = useState<Array<SurveyItem>>(questions.map(question => ({
    question,
    agreementLevel: null,
    timestamp: null
  })));

  useEffect(() => {

    setUserCanMoveToNextPage(
      !Object.values(surveyItems).some(((surveyItem: SurveyItem) => surveyItem.agreementLevel == null)
      )
    )

  }, [surveyItems])

  return (

    <div className="space-y-2">

      <Card>

        <CardHeader>
          <CardTitle className="text-2xl">
            Survey
          </CardTitle>
          <CardDescription>
            {title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <SurveyItemsTable
              surveyItems={surveyItems}
              setSurveyItems={setSurveyItems}
              numberedAgreementLevelLabels={numberedAgreementLevelLabels}
              minAgreementLabel={minAgreementLabel}
              maxAgreementLabel={maxAgreementLabel}
              doesNotFitOption={doesNotFitOption}
            />
          </div>

        </CardContent>

      </Card>



      <Button className="hover:cursor-pointer" onClick={() => {

        setUserFormData(o => {

          const newUserFormData = { ...o };

          if (newUserFormData.survey) {
            ((newUserFormData.survey.value as unknown) as Record<string, Array<SurveyItem>>)[surveyItemQuestionCategory.name] = surveyItems;
          }

          return newUserFormData;
        })

        goToNextFormPage();

      }} disabled={!userCanMoveToNextPage}>
        Next
        <ChevronRight />
      </Button>

    </div>

  )

}

interface SurveyItemsTableProps {
  surveyItems: Array<SurveyItem>,
  setSurveyItems: Dispatch<SetStateAction<Array<SurveyItem>>>,
  numberedAgreementLevelLabels?: number,
  minAgreementLabel: string,
  maxAgreementLabel: string,
  doesNotFitOption: boolean
}

export function SurveyItemsTable({ surveyItems, setSurveyItems, numberedAgreementLevelLabels, minAgreementLabel, maxAgreementLabel, doesNotFitOption }: SurveyItemsTableProps) {

  const agreementLevelLabels = [
    "Strongly disagree",
    "Somewhat disagree",
    "Neither agree nor disagree",
    "Somewhat agree",
    "Strongly agree"
  ]

  const setAgreementLevel = (question: string, agreementLevel: number | "N/A") => {

    const newSurveyItems = [...surveyItems];

    for (const index in surveyItems) {
      if (newSurveyItems[index].question == question) {
        newSurveyItems[index].agreementLevel = agreementLevel;
        newSurveyItems[index].timestamp = Date.now();
      }
    }

    setSurveyItems(newSurveyItems);

  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead className="w-[48rem]">
            <div className={`flex flex-row justify-between space-x-4 ${numberedAgreementLevelLabels ? "px-12" : "px-2"} ${doesNotFitOption && "pl-10"}`}>
              {numberedAgreementLevelLabels ? (
                <>
                  {doesNotFitOption && <span className="w-11">Does not fit</span>}
                  {[...Array(numberedAgreementLevelLabels + 1)].map((_, index) => (
                    (index != 0 || doesNotFitOption) && <span key={index}>{index}</span>
                  ))}
                </>
              ) : (
                agreementLevelLabels.map((label, index) => (
                  <span key={index}>{label}</span>
                ))
              )}
            </div>
            {numberedAgreementLevelLabels && (
              <div className="flex justify-between text-muted-foreground font-thin text-xs my-2 px-10">
                <span>{minAgreementLabel}</span>
                <span>{maxAgreementLabel}</span>
              </div>
            )}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {surveyItems.map((surveyItem: SurveyItem, index: number) => (
          <TableRow key={index}>
            <TableCell className="max-w-40">
              <span className="whitespace-normal break-words">
                {surveyItem.question}
              </span>
            </TableCell>
            <TableCell>
              <RadioGroup
                className={`flex flex-row justify-between px-10`}
                onValueChange={value => { setAgreementLevel(surveyItem.question, parseInt(value) == -1 ? "N/A" : parseInt(value)) }}
              >
                {doesNotFitOption && <span className="w-14">
                  <RadioGroupItem
                    value="-1"
                    className="w-6 h-6 self-center"
                  />
                </span>}
                {numberedAgreementLevelLabels
                  ? [...Array(numberedAgreementLevelLabels + 1)].map((_, index) => (
                    (index != 0 || doesNotFitOption) && <RadioGroupItem
                      value={(index).toString()}
                      key={index}
                      className="w-6 h-6"
                    />
                  ))
                  : (
                    agreementLevelLabels.map((label, index) => (
                      <RadioGroupItem value={index.toString()} key={index} className="w-6 h-6" />
                    ))
                  )
                }
              </RadioGroup>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
  )

}