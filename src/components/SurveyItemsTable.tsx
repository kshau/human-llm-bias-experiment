"use client";;
import { SurveyItem, SurveyItems } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface SurveyItemsTableProps {
  surveyItems: SurveyItems
  setSurveyItems: Dispatch<SetStateAction<SurveyItems>>, 
  surveyItemsCategory: keyof SurveyItems, 
  slider?: boolean
}

export function SurveyItemsTable({ surveyItems, setSurveyItems, surveyItemsCategory, slider = false } : SurveyItemsTableProps) {

  const agreementLevelLabels = [
    "Strongly disagree", 
    "Somewhat disagree", 
    "Neither agree nor disagree", 
    "Somewhat agree", 
    "Strongly agree"
  ]

  const setAgreementLevel = (question: string, agreementLevel: number) => {

    const newSurveyItemsInCategory = surveyItems[surveyItemsCategory];

    for (const itemIndex in newSurveyItemsInCategory) {
      if (newSurveyItemsInCategory[itemIndex].question == question) {
        newSurveyItemsInCategory[itemIndex].agreementLevel = agreementLevel;
        newSurveyItemsInCategory[itemIndex].timestamp = Date.now();
      }
    }
    
    setSurveyItems(o => ({
      ...o, 
      [surveyItemsCategory]: newSurveyItemsInCategory
    }))

  }

  return (
    <Table>
      <TableHeader>
          <TableRow>
            <TableHead/>
            <TableHead className="w-[48rem]">
              <div className="flex flex-row justify-between space-x-4 px-1">
                {slider ? (
                  [...Array(10)].map((_, index) => (
                    <span key={index}>{index + 1}</span>
                  ))
                ) : agreementLevelLabels.map((label, index) => (
                  <span key={index}>{label}</span>
                ))}
              </div>
              {slider && (
                <div className="flex justify-between text-muted-foreground font-thin text-xs my-2">
                  <span>Not at all</span>
                  <span>Completely agree</span>
                </div>
              )}
            </TableHead>
          </TableRow>
      </TableHeader>
      <TableBody>
        {surveyItems[surveyItemsCategory].map((surveyItem: SurveyItem, index: number) => (
          <TableRow key={index}>
            <TableCell className="max-w-40">
              <span className="whitespace-normal break-words">
                {surveyItem.question}
              </span>
            </TableCell>
            <TableCell>
              {slider ? (
                <Slider min={1} max={10} step={1} onValueChange={value => {setAgreementLevel(surveyItem.question, value[0])}} onClick={() => {if (!surveyItem.agreementLevel) {setAgreementLevel(surveyItem.question, 1)}}}/>
              ) : (
                <RadioGroup className="flex flex-row justify-between px-10" onValueChange={value => {setAgreementLevel(surveyItem.question, parseInt(value))}}>
                  {[1, 2, 3, 4, 5].map((agreementLevel, index) => (
                    <RadioGroupItem value={agreementLevel.toString()} key={index} className="w-6 h-6"/>
                  ))}
                </RadioGroup>
              )}
              
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
  )

}