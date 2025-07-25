"use client";
import { Button } from "@/components/ui/button"

import { ChoseToHitOption, ChoseToHitOptionsSet, UserFormData } from "@/lib/utils"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Check, ChevronRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface ChoseToHitFormPageProps {
  goToNextFormPage: CallableFunction, 
  setUserFormData: Dispatch<SetStateAction<UserFormData>>, 
  userFormDataChoseToHitKey: string, 
  optionsSet: ChoseToHitOptionsSet
}

export function ChoseToHitFormPage({ goToNextFormPage, setUserFormData, userFormDataChoseToHitKey, optionsSet } : ChoseToHitFormPageProps) {

  const [selectedOption, setSelectedOption] = useState<ChoseToHitOption | null>(null);
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

                    <ChoseToHitFormPageOptionCard choseToHitOption="barrier" userChoseToHitOption={selectedOption} imgSrc={`/assets/chose-to-hit-options-set-${optionsSet}/barrier.png`} description={<div className="w-40">
                    In this case, the self-driving car with sudden brake failure will continue ahead and crash into a concrete barrier. This will result in deaths of
                    <ul className="list-disc list-inside">
                        <li>1 man</li>
                        <li>1 woman</li>
                    </ul>
                    </div>} showDescriptionOnSide="left" setChoseToHitSelectedOption={setSelectedOption}/>

                    <ChoseToHitFormPageOptionCard choseToHitOption="pedestrians" userChoseToHitOption={selectedOption}  imgSrc={`/assets/chose-to-hit-options-set-${optionsSet}/pedestrians.png`} description={<div className="w-40">
                    In this case, the self-driving car with sudden brake failure will swerve and drive through a pedestrian crossing in the other lane. This will result in deaths of
                    <ul className="list-disc list-inside">
                        <li>1 female athlete</li>
                        <li>1 male athlete</li>
                    </ul>
                    Note that the affected pedestrians are abiding by the law by crossing on the green signal.
                    </div>} showDescriptionOnSide="right" setChoseToHitSelectedOption={setSelectedOption}/>

                </div>

            </CardContent>

        </Card>

      
      
      {selectedOption && <ChoseToHitFormPageConfidenceCard setChoseToHitConfidence={setConfidence}/>}

      <Button className="hover:cursor-pointer" onClick={() => {
        setUserFormData(o => ({
            ...o, 
            [userFormDataChoseToHitKey]: {
              value: {
                selectedOption, 
                confidence
              }, 
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
  choseToHitOption: ChoseToHitOption,
  userChoseToHitOption: ChoseToHitOption | null,
  imgSrc: string, 
  description: ReactNode, 
  showDescriptionOnSide: "right" | "left",
  setChoseToHitSelectedOption: Dispatch<SetStateAction<ChoseToHitOption | null>>
}

function ChoseToHitFormPageOptionCard({ choseToHitOption, userChoseToHitOption, imgSrc, description, showDescriptionOnSide, setChoseToHitSelectedOption } : ChoseToHitFormPageOptionHoverCardProps) {

  return (

    <div className="flex flex-row gap-x-4">

      {showDescriptionOnSide == "left" && description}

      <div className="relative inline-block">
        <img
          src={imgSrc}
          className="rounded-lg w-64 hover:cursor-pointer"
          onClick={() => setChoseToHitSelectedOption(choseToHitOption)}
        />
        {choseToHitOption == userChoseToHitOption && (
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
  setChoseToHitConfidence: Dispatch<SetStateAction<number | null>>
}

function ChoseToHitFormPageConfidenceCard({ setChoseToHitConfidence } : ChoseToHitFormPageConfidenceCardProps) {

    return (
        
            <Card className="w-[40rem]">

                <CardHeader>
                    <CardTitle className="text-2xl">
                        How Confident Are You in Your Judgement?
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <RadioGroup className={`flex flex-row justify-between`} onValueChange={value => {setChoseToHitConfidence(parseInt(value))}}>
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