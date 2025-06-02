"use client"

import { HomeFormPageProps } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { useEffect, useState } from "react";

export function PostDiscussionSurveyFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

    const [userConfidence, setUserConfidence] = useState<number>(7);

    return (

        <Card className="w-fit">

            <CardHeader>
                <CardTitle className="text-2xl">
                    Post-Discussion Opinion Survey
                </CardTitle>
                <CardDescription>
                    How confident are you in your judgement after talking to the LLM?
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Slider value={[userConfidence]} min={1} max={7} step={1} className="w-96" onValueChange={values => {setUserConfidence(values[0])}}/>
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

            <CardFooter>
                <Button className="hover:cursor-pointer" onClick={() => {

                    setUserFormData(o => ({
                        ...o, 
                        postDiscussionConfidence: {
                            value: userConfidence, 
                            timestamp: Date.now()
                        }
                    }));

                    goToNextFormPage(true);

                }}>
                    Done
                </Button>

            </CardFooter>

        </Card>

    )

}