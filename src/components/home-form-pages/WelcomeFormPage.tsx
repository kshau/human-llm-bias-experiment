"use client";
import { Button } from "@/components/ui/button"

import { HomeFormPageProps } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChevronRight } from "lucide-react"

export function WelcomeFormPage({ goToNextFormPage } : HomeFormPageProps) {

  return (

    <div className="space-y-2">

      <Card className="w-[40rem]">

          <CardHeader>
              <CardTitle className="text-2xl">
                  Welcome!
              </CardTitle>
          </CardHeader>
          <CardContent>
                Thank you for participating in our research examining how people discuss and evaluate
                decisions involving autonomous vehicles with conversational agents. <br/><br/>
                You will be asked to read a scenario, engage in a short discussion with a conversational partner,
                and complete some brief surveys about your views and confidence. <br/><br/>
                The total study is around 20 minutes.
          </CardContent>

      </Card>

      <Button className="hover:cursor-pointer" onClick={() => {goToNextFormPage()}}>
        Next
        <ChevronRight/>
      </Button>

    </div>

  )

}