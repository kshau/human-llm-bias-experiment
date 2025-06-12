"use client"

import { Button } from "@/components/ui/button"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ChoseToHit, HomeFormPageProps } from "@/lib/utils"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ConfidenceSurveyCard } from "../ConfidenceSurveyCard"
import { ChevronRight } from "lucide-react"

export function ChoseToHitFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

  const [choseToHit, setChoseToHit] = useState<ChoseToHit | null>(null);
  const [preDiscussionConfidence, setPrediscussionConfidence] = useState<number | null>(null);

  return (

    <div className="space-y-2">

      <Card className="w-full">

          <CardHeader>
              <CardTitle className="text-2xl">
                  Pick One
              </CardTitle>
              <CardDescription>
                  Hover over each to see more about the situation.
              </CardDescription>
          </CardHeader>

          <CardContent>

              <div className="grid grid-cols-2 gap-2 w-fit">

                  <ChoseToHitFormPageOptionHoverCard choseToHitOption="barrier" userChoseToHit={choseToHit} imgSrc="/assets/car-hit-barrier.png" title="Hit The Barrier" description={<div>
                  In this case, the self-driving car with sudden brake failure will continue ahead and crash into a concrete barrier. This will result in deaths of
                  <ul className="list-disc list-inside">
                      <li>1 man</li>
                      <li>1 woman</li>
                  </ul>
                  </div>} setChoseToHit={setChoseToHit}/>

                  <ChoseToHitFormPageOptionHoverCard choseToHitOption="pedestrians" userChoseToHit={choseToHit} imgSrc="/assets/car-hit-pedestrians.png" title="Hit The Pedestrians" description={<div>
                  In this case, the self-driving car with sudden brake failure will swerve and drive through a pedestrian crossing in the other lane. This will result in deaths of
                  <ul className="list-disc list-inside">
                      <li>1 female athlete</li>
                      <li>1 male athlete</li>
                  </ul>
                  Note that the affected pedestrians are abiding by the law by crossing on the green signal.
                  </div>} setChoseToHit={setChoseToHit}/>

              </div>

          </CardContent>

      </Card>
      
      {choseToHit && <ConfidenceSurveyCard confidence={preDiscussionConfidence} setConfidence={setPrediscussionConfidence}/>}

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

interface ChoseToHitFormPageOptionHoverCardProps {
  choseToHitOption: ChoseToHit,
  userChoseToHit: ChoseToHit | null,
  imgSrc: string, 
  title: string, 
  description: ReactNode, 
  setChoseToHit: Dispatch<SetStateAction<ChoseToHit | null>>
}

function ChoseToHitFormPageOptionHoverCard({ choseToHitOption, userChoseToHit, imgSrc, title, description, setChoseToHit } : ChoseToHitFormPageOptionHoverCardProps) {

  return (
    <Button
      variant="outline"
      className={`h-fit hover:cursor-pointer p-2 ${choseToHitOption == userChoseToHit && "!bg-primary"}`}
      onClick={() => setChoseToHit(choseToHitOption)}
    >
      <HoverCard>
        <HoverCardTrigger>
          <img src={imgSrc} className="rounded-md w-64"/>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="space-y-2">
            <span className="text-lg font-semibold">{title}</span>
            <div className="text-md">
              {description}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </Button>
    
  )

}