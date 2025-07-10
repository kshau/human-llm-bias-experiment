import React, { useState } from "react";

export function ConsentFormPage({ goToNextFormPage }: { goToNextFormPage: () => void }) {
  const [consentChoice, setConsentChoice] = useState<null | "consent" | "no-consent">(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted && consentChoice === "no-consent") {
    return (
      <div className="flex flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
        <p className="text-lg">You have chosen not to participate in this study. No data has been collected.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Consent Form</h1>
      <a href="/assets/consent.pdf" target="_blank" rel="noopener noreferrer" className="mb-2 text-blue-600 underline">
        Open Consent Form in a new tab
      </a>
      <iframe
        src="/assets/consent.pdf"
        width="600"
        height="800"
        title="Consent Form"
        className="mb-4 border border-gray-300"
      />
      <div className="flex flex-col gap-4 mb-4 w-full max-w-md">
        <label className="flex items-center text-lg cursor-pointer">
          <input
            type="radio"
            name="consent-choice"
            value="consent"
            checked={consentChoice === "consent"}
            onChange={() => setConsentChoice("consent")}
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
            onChange={() => setConsentChoice("no-consent")}
            className="mr-2"
          />
          I do NOT consent to participate in this study
        </label>
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={() => {
          if (consentChoice === "consent") {
            goToNextFormPage();
          } else if (consentChoice === "no-consent") {
            setSubmitted(true);
          }
        }}
        disabled={!consentChoice}
      >
        Continue
      </button>
    </div>
  );
} 