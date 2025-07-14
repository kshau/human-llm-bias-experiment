"use client"

import { Button } from "@/components/ui/button"
import { ChoseToHit, HomeFormPageProps } from "@/lib/utils"
import { Dispatch, SetStateAction, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ConfidenceCard } from "../ConfidenceCard"
import { Check, ChevronRight } from "lucide-react"
import { BackgroundGradient } from "../ui/background-gradient"

export function ChoseToHitFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

  const [choseToHit, setChoseToHit] = useState<ChoseToHit | null>(null);
  const [preDiscussionConfidence, setPrediscussionConfidence] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <BackgroundGradient>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">
              Pick One
            </CardTitle>
            <CardDescription>
              Please read each scenario and select your choice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-start justify-center gap-4 w-full">
              {/* Text for Barrier */}
              <div className="max-w-[13rem] text-md flex flex-col">
                <div className="font-bold text-lg mb-2 text-center">Hit The Barrier</div>
                <div className="text-justify">
                  In this case, the self-driving car with sudden brake failure will continue ahead and crash into a concrete barrier. This will result in deaths of
                </div>
                <ul className="list-disc list-inside ml-4 text-left">
                  <li>1 man</li>
                  <li>1 woman</li>
                </ul>
              </div>
              {/* Image for Barrier */}
              <div className="relative inline-block">
                <img
                  src="/assets/car-hit-barrier.png"
                  className="rounded-lg w-64 hover:cursor-pointer"
                  onClick={() => setChoseToHit("barrier")}
                />
                {choseToHit === "barrier" && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 z-20">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                )}
              </div>
              {/* Image for Pedestrians */}
              <div className="relative inline-block">
                <img
                  src="/assets/car-hit-pedestrians.png"
                  className="rounded-lg w-64 hover:cursor-pointer"
                  onClick={() => setChoseToHit("pedestrians")}
                />
                {choseToHit === "pedestrians" && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 z-20">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                )}
              </div>
              {/* Text for Pedestrians */}
              <div className="max-w-[13rem] text-md flex flex-col">
                <div className="font-bold text-lg mb-2 text-center">Hit The Pedestrians</div>
                <div className="text-justify">
                  In this case, the self-driving car with sudden brake failure will swerve and drive through a pedestrian crossing in the other lane. This will result in deaths of
                </div>
                <ul className="list-disc list-inside ml-4 text-left">
                  <li>1 female athlete</li>
                  <li>1 male athlete</li>
                </ul>
                <div className="text-justify mt-1">Note that the affected pedestrians are abiding by the law by crossing on the green signal.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </BackgroundGradient>
      {choseToHit && <ConfidenceCard confidence={preDiscussionConfidence} setConfidence={setPrediscussionConfidence}/>}
      <Button className="hover:cursor-pointer" onClick={() => {
        setUserFormData(o => ({
            ...o, 
            choseToHit: {
              value: choseToHit || "barrier", 
              timestamp: Date.now()
            },
            preDiscussionConfidence: {
              value: preDiscussionConfidence || 4, 
              timestamp: Date.now()
            },
          }))
          goToNextFormPage();
        }}
        disabled={!preDiscussionConfidence}
      >
        Next
        <ChevronRight/>
      </Button>
    </div>
  )
}
