"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChevronRight } from "lucide-react";
import { BackgroundGradient } from "../ui/background-gradient";
import { surveyItemQuestions } from "@/lib/utils";
import { Slider } from "../ui/slider";

export function MiscellaneousSurveyFormPage({ goToNextFormPage, setUserFormData }: { goToNextFormPage: () => void, setUserFormData: (fn: (prev: any) => any) => void }) {
  const questions = surveyItemQuestions.miscellaneous;
  const [responses, setResponses] = useState<(number | null)[]>(Array(questions.length).fill(null));

  const handleChange = (index: number, value: number) => {
    setResponses(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Ensure clicking the slider at the default value (4) marks it as answered
  const handleSliderClick = (idx: number) => {
    if (responses[idx] === null) {
      handleChange(idx, 4);
    }
  };

  const handleNext = () => {
    setUserFormData((prev: any) => ({
      ...prev,
      survey: {
        ...prev.survey,
        value: {
          ...((prev.survey?.value as object) || {}),
          miscellaneous: questions.map((q, i) => ({
            question: typeof q === "string" ? q : q.question,
            agreementLevel: responses[i],
            timestamp: Date.now(),
            minLabel: q.minLabel,
            maxLabel: q.maxLabel
          }))
        }
      }
    }));
    goToNextFormPage();
  };

  const allAnswered = responses.every(r => r !== null);

  return (
    <div className="space-y-2">
      <BackgroundGradient>
        <Card className="w-[40rem]">
          <CardHeader>
            <CardTitle className="text-2xl">
              Additional Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {questions.map((q, idx) => (
                <div key={idx} className="mb-8">
                  <div className="mb-2 font-medium">{q.question}</div>
                  <Slider
                    value={[responses[idx] ?? 4]}
                    min={1}
                    max={7}
                    step={1}
                    onValueChange={values => handleChange(idx, values[0])}
                    onClick={() => handleSliderClick(idx)}
                    className="my-4"
                  />
                  <div className="flex justify-between mt-2 w-[98%] ml-[1%] font-bold">
                    {[...Array(7).keys()].map(index => (
                      <span key={index}>{index + 1}</span>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 font-thin">
                    <span>{q.minLabel}</span>
                    <span>{q.maxLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </BackgroundGradient>
      <Button className="hover:cursor-pointer" onClick={handleNext} disabled={!allAnswered}>
        Next
        <ChevronRight/>
      </Button>
    </div>
  );
} 