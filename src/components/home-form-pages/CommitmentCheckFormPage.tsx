import React, { useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export function CommitmentCheckFormPage({ goToNextFormPage, setUserFormData }: { goToNextFormPage: () => void, setUserFormData?: (fn: (prev: any) => any) => void }) {
  const [commitment, setCommitment] = useState<string | null>(null);
  const [warning, setWarning] = useState(false);
  const [booted, setBooted] = useState(false);

  const handleContinue = () => {
    if (commitment === "option 1") {
      if (setUserFormData) {
        setUserFormData((prev: any) => ({ ...prev, commitment }));
      }
      goToNextFormPage();
    } else {
      if (!warning) {
        setWarning(true);
      } else {
        setBooted(true);
      }
    }
  };

  if (booted) {
    return (
      <div className="flex flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
        <p className="text-lg">You are not eligible for this study. No data has been collected.</p>
      </div>
    );
  }

  return (
    <BackgroundGradient>
      <Card className="w-[40rem]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4 text-center">Commitment Check</CardTitle>
        </CardHeader>
        <CardContent>
          <fieldset className="form-group">
            <legend className="text-lg mb-4 block">
              We care about the quality of our survey data. For us to get the most accurate measures of your performance and opinions, it is important that you provide thoughtful answers to each question in the task.
              <br /><br />
              Do you commit to providing thoughtful answers to the questions?
            </legend>
            <div className="flex flex-col gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="commitment-check" value="option 1" checked={commitment === "option 1"} onChange={() => { setCommitment("option 1"); setWarning(false); }}/>
                <span>Yes, I will.</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="commitment-check" value="option 2" checked={commitment === "option 2"} onChange={() => { setCommitment("option 2"); setWarning(false); }}/>
                <span>No, I will not.</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="commitment-check" value="option 3" checked={commitment === "option 3"} onChange={() => { setCommitment("option 3"); setWarning(false); }}/>
                <span>I can't promise either way.</span>
              </label>
            </div>
          </fieldset>
          {warning && commitment !== "option 1" && (
            <div className="mt-4 text-red-600 font-semibold">
              You will not be eligible for this study unless you commit to providing thoughtful answers. Please change your answer if you wish to continue.
            </div>
          )}
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              onClick={handleContinue}
              disabled={!commitment}
            >
              Continue
            </button>
          </div>
        </CardContent>
      </Card>
    </BackgroundGradient>
  );
} 