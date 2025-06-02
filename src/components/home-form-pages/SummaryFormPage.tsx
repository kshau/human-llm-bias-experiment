"use client"

import { HomeFormPageProps } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";

export function SummaryFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

    const [userSummary, setUserSummary] = useState<string>("");

    return (

        <Card className="w-fit">

            <CardHeader>
                <CardTitle className="text-2xl">
                    Summarize
                </CardTitle>
                <CardDescription>
                    Please summarize the conversation you just had with the LLM.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Textarea className="w-96 h-40" onChange={e => {setUserSummary(e.target.value)}}/>
            </CardContent>

            <CardFooter>
                <Button className="hover:cursor-pointer" onClick={() => {

                    setUserFormData(o => ({
                        ...o, 
                        conversationWithLLMSummary: {
                            value: userSummary, 
                            timestamp: Date.now()
                        }
                    }))

                    goToNextFormPage();

                }} disabled={userSummary.length <= 0}>
                    Done
                </Button>
            </CardFooter>

        </Card>

    )

}