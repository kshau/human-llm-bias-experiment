"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dispatch, SetStateAction } from "react";
import { Slider } from "./ui/slider";
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
                    <Slider value={[confidence || 4]} min={1} max={7} step={1} onValueChange={values => {setConfidence(values[0])}} onClick={() => {
                        if (!confidence) {
                            setConfidence(4);
                        }
                    }}/>
                    <div className="flex justify-between mt-2 w-[98%] ml-[1%] font-bold">
                        {[...Array(7).keys()].map(index => (
                            <span key={index}>{index + 1}</span>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-4 font-thin">
                        <span>Least confidence</span>
                        <span>Most confidence</span>
                    </div>
                </CardContent>

            </Card>
        </BackgroundGradient>

    )

}