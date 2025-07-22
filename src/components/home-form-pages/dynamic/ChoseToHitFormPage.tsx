"use client";
import { Button } from "@/components/ui/button"

import { ChoseToHit, UserFormData } from "@/lib/utils"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Check, ChevronRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface ChoseToHitFormPageProps {
  goToNextFormPage: CallableFunction, 
  setUserFormData: Dispatch<SetStateAction<UserFormData>>, 
  userFormDataChoseToHitKey: string, 
  userFormDataConfidenceKey: string
}

export function ChoseToHitFormPage({ goToNextFormPage, setUserFormData, userFormDataChoseToHitKey, userFormDataConfidenceKey } : ChoseToHitFormPageProps) {

  const [choseToHit, setChoseToHit] = useState<ChoseToHit | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  return (

    <div className="space-y-2">

        <Card>

            <CardHeader>
                <CardTitle className="text-2xl">
                    Pick One
                </CardTitle>
            </CardHeader>

            <CardContent>

                <div className="grid grid-cols-2 gap-2 w-fit">

                    <ChoseToHitFormPageOptionCard choseToHitOption="barrier" userChoseToHit={choseToHit} imgSrc="/assets/car-hit-barrier.png" description={<div className="w-40">
                    In this case, the self-driving car with sudden brake failure will continue ahead and crash into a concrete barrier. This will result in deaths of
                    <ul className="list-disc list-inside">
                        <li>1 man</li>
                        <li>1 woman</li>
                    </ul>
                    </div>} showDescriptionOnSide="left" setChoseToHit={setChoseToHit}/>

                    <ChoseToHitFormPageOptionCard choseToHitOption="pedestrians" userChoseToHit={choseToHit} imgSrc="/assets/car-hit-pedestrians.png" description={<div className="w-40">
                    In this case, the self-driving car with sudden brake failure will swerve and drive through a pedestrian crossing in the other lane. This will result in deaths of
                    <ul className="list-disc list-inside">
                        <li>1 female athlete</li>
                        <li>1 male athlete</li>
                    </ul>
                    Note that the affected pedestrians are abiding by the law by crossing on the green signal.
                    </div>} showDescriptionOnSide="right" setChoseToHit={setChoseToHit}/>

                </div>

            </CardContent>

        </Card>

      
      
      {choseToHit && <ChoseToHitFormPageConfidenceCard setConfidence={setConfidence}/>}

      <Button className="hover:cursor-pointer" onClick={() => {
        setUserFormData(o => ({
            ...o, 
            [userFormDataChoseToHitKey]: {
              value: choseToHit || "barrier", 
              timestamp: Date.now()
            },
            [userFormDataConfidenceKey]: {
              value: confidence || 4, 
              timestamp: Date.now()
            },
          }))
          goToNextFormPage();
        }}
        disabled={!confidence}
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
  description: ReactNode, 
  showDescriptionOnSide: "right" | "left",
  setChoseToHit: Dispatch<SetStateAction<ChoseToHit | null>>
}

function ChoseToHitFormPageOptionCard({ choseToHitOption, userChoseToHit, imgSrc, description, showDescriptionOnSide, setChoseToHit } : ChoseToHitFormPageOptionHoverCardProps) {

  return (

    <div className="flex flex-row gap-x-4">

      {showDescriptionOnSide == "left" && description}

      <div className="relative inline-block">
        <img
          src={imgSrc}
          className="rounded-lg w-64 hover:cursor-pointer"
          onClick={() => setChoseToHit(choseToHitOption)}
        />
        {choseToHitOption == userChoseToHit && (
          <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 z-20">
            <Check className="w-7 h-7 text-white" />
          </div>
        )}
      </div>

      {showDescriptionOnSide == "right" && description}

    </div>

  )

}

interface ChoseToHitFormPageConfidenceCardProps {
  setConfidence: Dispatch<SetStateAction<number | null>>
}

function ChoseToHitFormPageConfidenceCard({ setConfidence } : ChoseToHitFormPageConfidenceCardProps) {

    return (
        
            <Card className="w-[40rem]">

                <CardHeader>
                    <CardTitle className="text-2xl">
                        How Confident Are You in Your Judgement?
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <RadioGroup className={`flex flex-row justify-between`} onValueChange={value => {setConfidence(parseInt(value))}}>
                      {[...Array(7)].map((_, index) => (
                        <RadioGroupItem value={(index + 1).toString()} key={index} className="w-6 h-6"/>
                      ))}
                    </RadioGroup>
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
        
    )

}