"use client";
import { Button } from "@/components/ui/button"

import { countries, Demographics, HomeFormPageProps, usStatesAndTerritories } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChevronRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";

export function DemographicsFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

  const genderChoices = [
    {
        label: "Male", 
        value: "male"
    }, 
    {
        label: "Female", 
        value: "female"
    }, 
    {
        label: "Non-binary third gender", 
        value: "nonBinary"
    }, 
    {
        label: "Prefer not to answer", 
        value: "preferNotToAnswer"
    }
  ]

  const raceChoices = [
    {
        label: "White or Caucasian", 
        value: "whiteOrCaucasian"
    }, 
    {
        label: "Black or African American", 
        value: "blackOrAfricanAmerican"
    }, 
    {
        label: "Asian", 
        value: "asian"
    }, 
    {
        label: "Native Hawaiian or other Pacific Islander", 
        value: "nativeHawaiianOrOtherPacificIslander"
    }, 
    {
        label: "Other", 
        value: "other"
    }, 
    {
        label: "Prefer not to answer", 
        value: "preferNotToAnswer"
    }
  ]

  const highestEducationLevelChoices = [
    {
        label: "Some high school or less", 
        value: "someHighSchoolOrLess"
    }, 
    {
        label: "High school or GED", 
        value: "highSchoolOrGED"
    }, 
    {
        label: "Some college", 
        value: "someCollege"
    }, 
    {
        label: "Associate's degree", 
        value: "associatesDegree"
    }, 
    {
        label: "Bachelor's degree", 
        value: "bachelorsDegree"
    }, 
    {
        label: "Graduate or professional degree (MA, MS, MBA, PhD, JD, etc.)", 
        value: "graduateOrProfessionalDegree"
    }, 
  ]

  const [invalidAge, setInvalidAge] = useState<boolean>(false);
  const [userCanMoveToNextPage, setUserCanMoveToNextPage] = useState<boolean>(false);

  const [demographics, setDemographics] = useState<Demographics>({
    age: 0, 
    gender: "",
    races: [],
    customRace: null,
    highestEducationLevel: "", 
    religion: "", 
    country: "", 
    usStateOrTerritory: null
  })

  useEffect(() => {

    const newInvalidAge = demographics.age != null && (demographics.age < 18 || demographics.age > 65);
    setInvalidAge(newInvalidAge);

    setUserCanMoveToNextPage(!(
        newInvalidAge ||
        !demographics.gender ||
        (demographics.races?.length ?? 0) <= 0 ||
        !demographics.highestEducationLevel ||
        !demographics.country ||
        (demographics.country == "US" && !demographics.usStateOrTerritory)
    ))

  }, [demographics])

  return (

    <div className="space-y-2">
    
    
        <Card className="w-[40rem]">

            <CardHeader>
                <CardTitle className="text-2xl">
                    Demographics
                </CardTitle>
                <CardDescription>
                    Please enter in the following information about yourself.
                </CardDescription>
            </CardHeader>
            <CardContent>
                    <div className="space-y-8">
                        <div>
                            <span className="font-semibold">Please enter your age.</span><DemographicsFormPageRedAsterisk/>
                            <Input className="mt-3 w-20 h-8 mb-1" type="number" min={18} max={65} step={1} value={demographics.age || ""} onChange={e => {
                                setDemographics(o => ({
                                    ...o, 
                                    age: parseInt(e.target.value)
                                }))
                            }}/>
                            {invalidAge ? (
                                <span className="text-sm text-destructive">Age must be between 18-65 for this study.</span>
                            ) : <></>}
                        </div>
                        <div>
                            <span className="font-semibold">What&apos;s your gender?</span><DemographicsFormPageRedAsterisk/>
                            <RadioGroup className="mt-3" value={demographics.gender} onValueChange={value => {
                                setDemographics(o => ({
                                    ...o, 
                                    gender: value
                                }))
                            }}>
                                {genderChoices.map(choice => (
                                    <div className="flex items-center gap-3" key={choice.value}>
                                        <RadioGroupItem value={choice.value} id={choice.value}/>
                                        <Label htmlFor={choice.value}>{choice.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        <div>
                            <span className="font-semibold">Choose one or more races you consider yourself to be.</span><DemographicsFormPageRedAsterisk/>
                            <div className="mt-4 space-y-3">
                                {raceChoices.map(choice => (
                                    <div className="flex items-center gap-3" key={choice.value}>
                                        <Checkbox 
                                            id={choice.value} 
                                            checked={demographics.races?.includes(choice.value)} 
                                            disabled={demographics.races?.includes("preferNotToAnswer") && choice.value != "preferNotToAnswer"} 
                                            onCheckedChange={checked => {
                                                if (checked) {
                                                    setDemographics(o => ({
                                                        ...o, 
                                                        races: choice.value == "preferNotToAnswer" ? [choice.value] : [...(o.races ?? []), choice.value], 
                                                        customRace: ""
                                                    }))
                                                } else {
                                                    setDemographics(o => ({
                                                        ...o, 
                                                        races: (o.races ? o.races.filter(race => (race != choice.value)) : []), 
                                                        customRace: choice.value == "other" ? null : o.customRace
                                                    }))
                                                }
                                            }
                                        }/>
                                        {(choice.value == "other") ? (
                                            <Input className="h-5 w-64 text-xs p-1" disabled={!demographics.races?.includes("other")} value={demographics.customRace || ""} onChange={e => {
                                                setDemographics(o => ({
                                                    ...o, 
                                                    customRace: e.target.value
                                                }))
                                            }}/>
                                        ) : (
                                            <Label htmlFor={choice.value}>{choice.label}</Label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold">What&apos;s your highest education level?</span><DemographicsFormPageRedAsterisk/>
                            <RadioGroup className="mt-3" onValueChange={value => {
                                    setDemographics(o => ({
                                        ...o, 
                                        highestEducationLevel: value
                                    }))
                                }}>
                                {highestEducationLevelChoices.map(choice => (
                                    <div className="flex items-center gap-3" key={choice.value}>
                                        <RadioGroupItem value={choice.value} id={choice.value}/>
                                        <Label htmlFor={choice.value}>{choice.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        <div>
                            <span className="font-semibold">What is your present religion, if any?</span>
                            <Input className="mt-3 w-64 h-8" onChange={e => {
                                setDemographics(o => ({
                                    ...o, 
                                    religion: e.target.value
                                }))
                            }}/>
                        </div>
                        <div>
                            <span className="font-semibold">In which country do you reside?</span><DemographicsFormPageRedAsterisk/>
                            <div className="mt-3 w-64">
                                <Select onValueChange={value => {
                                    setDemographics(o => ({
                                        ...o, 
                                        country: value, 
                                        usStateOrTerritory: value == "US" ? "" : null
                                    }))
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a country"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country, index) => (
                                            <SelectItem value={country.value} key={index}>
                                                {country.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                        </div>
                        {demographics.country == "US" && (
                            <div>
                                <span className="font-semibold">In which state do you reside?</span><DemographicsFormPageRedAsterisk/>
                                <div className="mt-3 w-64">
                                    <Select onValueChange={value => {
                                        setDemographics(o => ({
                                            ...o, 
                                            usStateOrTerritory: value
                                        }))
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a state or territory"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {usStatesAndTerritories.map((stateOrTerritory, index) => (
                                                <SelectItem value={stateOrTerritory.value} key={index}>
                                                    {stateOrTerritory.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
            </CardContent>

        </Card>

      

      <Button className="hover:cursor-pointer" onClick={() => {

        setUserFormData(o => ({
            ...o,
            demographics: {
                value: demographics, 
                timestamp: Date.now()
            }
        }))

        goToNextFormPage()
    }} disabled={!userCanMoveToNextPage}>
        Next
        <ChevronRight/>
      </Button>

    </div>

  )

}

function DemographicsFormPageRedAsterisk() {
    return <span className="text-destructive"> *</span>
}