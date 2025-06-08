"use client"

import { Button } from "@/components/ui/button"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { HomeFormPageProps, UserFormData } from "@/lib/utils"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export function ChoseToHitFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

  return (

    <Card className="w-fit">

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

                <ChoseToHitFormPageOptionHoverCard choseToHitOption="barrier" imgSrc="/assets/car-hit-barrier.png" title="Hit The Barrier" description={<div>
                In this case, the self-driving car with sudden brake failure will continue ahead and crash into a concrete barrier. This will result in deaths of
                <ul className="list-disc list-inside">
                    <li>1 man</li>
                    <li>1 woman</li>
                </ul>
                </div>} goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData}/>

                <ChoseToHitFormPageOptionHoverCard choseToHitOption="pedestrians" imgSrc="/assets/car-hit-pedestrians.png" title="Hit The Pedestrians" description={<div>
                In this case, the self-driving car with sudden brake failure will swerve and drive through a pedestrian crossing in the other lane. This will result in deaths of
                <ul className="list-disc list-inside">
                    <li>1 female athlete</li>
                    <li>1 male athlete</li>
                </ul>
                Note that the affected pedestrians are abiding by the law by crossing on the green signal.
                </div>} goToNextFormPage={goToNextFormPage} setUserFormData={setUserFormData}/>

            </div>

        </CardContent>

    </Card>

  )

}

interface ChoseToHitFormPageOptionHoverCardProps {
  choseToHitOption: "barrier" | "pedestrians",
  imgSrc: string, 
  title: string, 
  description: ReactNode, 
  goToNextFormPage: CallableFunction, 
  setUserFormData: Dispatch<SetStateAction<UserFormData>>
}

function ChoseToHitFormPageOptionHoverCard({ choseToHitOption, imgSrc, title, description, goToNextFormPage, setUserFormData } : ChoseToHitFormPageOptionHoverCardProps) {

  return (
    <Button className="h-fit hover:cursor-pointer" variant="outline" onClick={() => {
        setUserFormData(o => ({
            ...o, 
            choseToHit: {
              value: choseToHitOption, 
              timestamp: Date.now()
            }
        }));
        goToNextFormPage();
    }}>
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