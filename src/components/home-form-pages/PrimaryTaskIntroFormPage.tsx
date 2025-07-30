"use client";
import { Button } from "@/components/ui/button"

import { HomeFormPageProps } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ChevronRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useState } from "react";
import NotEligibleFormPage from "./NotEligibleFormPage";

export function PrimaryTaskIntroFormPage({ goToNextFormPage } : HomeFormPageProps) {

  const [userComitted, setUserComitted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (submitted && !userComitted) {
      return <NotEligibleFormPage/>
  }

  return (

    <div className="space-y-2">

      
        <Card className="w-[40rem]">

            <CardHeader>
              <CardTitle className="text-2xl">
                Task Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>

              <div>

                <span>
                  Next, you will provide your views on
                  an ethical dilemma. You will then have an opportunity to discuss your choice with an LLM.
                </span>

                <div className="mt-4">
                  <span className="font-semibold">
                    Will you do your best to stay on topic during the duration of the interaction with the LLM?
                  </span>

                  <RadioGroup className="mt-6" onValueChange={value => setUserComitted(value == "comitted")} defaultValue="notComitted">
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="comitted"/>
                        <Label>Yes.</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="notComitted"/>
                        <Label>No.</Label>
                    </div>
                  </RadioGroup>
                </div>

              </div>

            </CardContent>

        </Card>
      

      <Button className="hover:cursor-pointer" onClick={() => {
            if (userComitted) {
                goToNextFormPage()
            }
            setSubmitted(true);
        }}>
            Next
            <ChevronRight/>
      </Button>

    </div>

  )

}