import React, { useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const consentPdfUrl = "/assets/consent.pdf";

export function ConsentFormPage({ goToNextFormPage }: { goToNextFormPage: () => void }) {
  const [consentChoice, setConsentChoice] = useState<null | "consent" | "no-consent">(null);
  const [submitted, setSubmitted] = useState(false);
  const [warning, setWarning] = useState(false);
  const [booted, setBooted] = useState(false);

  if (booted) {
    return (
      <div className="flex flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
        <p className="text-lg">You are not eligible for this study. No data has been collected.</p>
      </div>
    );
  }

  if (submitted && consentChoice === "no-consent") {
    return (
      <div className="flex flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
        <p className="text-lg">You have chosen not to participate in this study. No data has been collected.</p>
      </div>
    );
  }

  const handleContinue = () => {
    if (consentChoice === "consent") {
      goToNextFormPage();
    } else if (consentChoice === "no-consent") {
      if (!warning) {
        setWarning(true);
      } else {
        setBooted(true);
      }
    }
  };

  return (
    <BackgroundGradient>
      <Card className="w-[40rem]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4 text-center">Consent Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <a
              href={consentPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 text-primary underline"
            >
              Open Consent Form in a new tab
            </a>
            <iframe
              src={consentPdfUrl}
              style={{ width: "100%", height: "80vh" }}
              title="Consent Form"
              className="mb-2 border border-gray-300 rounded"
            />
            <div className="text-xs text-muted-foreground mb-4">
              You can zoom in/out or open in a new tab for a better view.
            </div>
            <div className="flex flex-col gap-4 mb-4 w-full max-w-md">
              <label className="flex items-center text-lg cursor-pointer">
                <input
                  type="radio"
                  name="consent-choice"
                  value="consent"
                  checked={consentChoice === "consent"}
                  onChange={() => { setConsentChoice("consent"); setWarning(false); }}
                  className="mr-2"
                />
                I have read and understood the consent form and agree to participate in this study.
              </label>
              <label className="flex items-center text-lg cursor-pointer">
                <input
                  type="radio"
                  name="consent-choice"
                  value="no-consent"
                  checked={consentChoice === "no-consent"}
                  onChange={() => { setConsentChoice("no-consent"); setWarning(false); }}
                  className="mr-2"
                />
                I do NOT consent to participate in this study
              </label>
            </div>
            {warning && consentChoice === "no-consent" && (
              <div className="mt-4 text-red-600 font-semibold">
                You will not be eligible for this study unless you provide consent. Please change your answer if you wish to continue.
              </div>
            )}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              onClick={handleContinue}
              disabled={!consentChoice}
            >
              Continue
            </button>
          </div>
        </CardContent>
      </Card>
    </BackgroundGradient>
  );
} 