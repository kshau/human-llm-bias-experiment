import { HomeFormPageProps } from "@/lib/utils";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronRight, SquareArrowOutUpRightIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

export function ConsentFormPage({ goToNextFormPage } : HomeFormPageProps) {

  const [userConsent, setUserConsent] = useState<boolean>(false);

  return (
    <div className="space-y-2">
    
        <Card className="w-[40rem]">

            <CardHeader>

                <CardTitle className="text-2xl">
                    Consent Form
                </CardTitle>
                
            </CardHeader>

            <CardContent>

                <iframe
                    src="/assets/consent.pdf"
                    width="600"
                    height="800"
                    className="mb-2"
                />

                <Link href="/assets/consent.pdf" target="_blank">
                    <Button variant="secondary">
                        <SquareArrowOutUpRightIcon/>
                        Open in new tab
                    </Button>
                </Link>

                <RadioGroup className="mt-6" onValueChange={value => setUserConsent(value == "consent")} defaultValue="no-consent">
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="consent"/>
                        <Label>I have read and understood the consent form and agree to participate in this study.</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="no-consent"/>
                        <Label>I do NOT consent to participate in this study.</Label>
                    </div>
                </RadioGroup>

            </CardContent>
      
        </Card>

        <Button className="hover:cursor-pointer" onClick={() => {
            goToNextFormPage()
        }} disabled={!userConsent}>
            Next
            <ChevronRight/>
        </Button>

    </div>
  );
} 
