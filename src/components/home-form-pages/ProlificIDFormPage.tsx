import { HomeFormPageProps } from "@/lib/utils";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

export function ProlificIDFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

  const [prolificID, setProlificID] = useState<string>("");
  const [confirmProlificID, setConfirmProlificID] = useState<boolean>(false);

  return (
    <div className="space-y-2">
    
        <Card className="w-[40rem]">

            <CardHeader>

                <CardTitle className="text-2xl">
                    Enter Your Prolific ID
                </CardTitle>

                <CardDescription>
                    Please enter your Prolific ID below so we can compensate you for your participation.
                </CardDescription>
                
            </CardHeader>

            <CardContent>

                <Input placeholder="Prolific ID" className="w-80" onChange={e => setProlificID(e.target.value)}/>

                <div className="flex gap-3 mt-4">
                    <Checkbox onCheckedChange={checked => setConfirmProlificID(checked as boolean)} checked={confirmProlificID}/>
                    <Label>I confirm this is my Prolific ID.</Label>
                </div>

            </CardContent>
      
        </Card>

        <Button className="hover:cursor-pointer" onClick={() => {

            setUserFormData(o => ({
                ...o,
                prolificID
            }))

            goToNextFormPage()
        }} disabled={!prolificID || !confirmProlificID}>
            Next
            <ChevronRight/>
        </Button>

    </div>
  );
} 
