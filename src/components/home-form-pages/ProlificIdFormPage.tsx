"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChevronRight } from "lucide-react";
import { BackgroundGradient } from "../ui/background-gradient";

export function ProlificIdFormPage({ goToNextFormPage, setUserFormData }: { goToNextFormPage: () => void, setUserFormData: (fn: (prev: any) => any) => void }) {
  const [prolificId, setProlificId] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleNext = () => {
    setUserFormData((prev: any) => ({ ...prev, prolificId }));
    goToNextFormPage();
  };

  return (
    <div className="space-y-2">
      <BackgroundGradient>
        <Card className="w-[40rem]">
          <CardHeader>
            <CardTitle className="text-2xl">
              Enter Your Prolific ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              Please enter your Prolific ID below so we can compensate you for your participation.
            </div>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Prolific ID"
              value={prolificId}
              onChange={e => setProlificId(e.target.value)}
              maxLength={50}
            />
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="prolific-confirm-checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="prolific-confirm-checkbox" className="text-base">
                I confirm this is my Prolific ID
              </label>
            </div>
          </CardContent>
        </Card>
      </BackgroundGradient>
      <Button className="hover:cursor-pointer" onClick={handleNext} disabled={!prolificId.trim() || !confirmed}>
        Next
        <ChevronRight/>
      </Button>
    </div>
  );
} 