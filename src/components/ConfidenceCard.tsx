"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dispatch, SetStateAction } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { BackgroundGradient } from "./ui/background-gradient";

interface ConfidenceSurveyCardProps {
  confidence: number | null, 
  setConfidence: Dispatch<SetStateAction<number | null>>
}

export function ConfidenceCard({ confidence, setConfidence } : ConfidenceSurveyCardProps) {

    return (

        <BackgroundGradient>
            <Card className="w-full">

                <CardHeader>
                    <CardTitle className="text-2xl">
                        How Confident Are You in Your Judgement?
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <RadioGroup
                        className="flex flex-row justify-between w-full mt-4"
                        value={confidence !== null ? confidence.toString() : undefined}
                        onValueChange={val => {
                            console.log('RadioGroup changed:', val);
                            setConfidence(Number(val));
                        }}
                    >
                        {[...Array(7).keys()].map(index => (
                            <div key={index} className="flex flex-col items-center">
                                <RadioGroupItem value={(index + 1).toString()} id={`confidence-${index + 1}`} />
                                <label htmlFor={`confidence-${index + 1}`} className="mt-1 text-sm font-bold cursor-pointer">
                                    {index + 1}
                                </label>
                            </div>
                        ))}
                    </RadioGroup>
                    <div className="flex justify-between text-xs text-muted-foreground mt-4 font-thin">
                        <span>Least confidence</span>
                        <span>Most confidence</span>
                    </div>
                </CardContent>

            </Card>
        </BackgroundGradient>

    )

}