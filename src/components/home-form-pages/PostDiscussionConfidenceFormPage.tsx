"use client"

import { HomeFormPageProps } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import { ConfidenceCard } from "../ConfidenceCard";
import { ChevronRight } from "lucide-react";

export function PostDiscussionConfidenceFormPage({ goToNextFormPage, setUserFormData } : HomeFormPageProps) {

    const [postDiscussionConfidence, setPostDiscussionConfidence] = useState<number | null>(null);

    return (

        <div className="space-y-2 w-[40rem]">

            <ConfidenceCard confidence={postDiscussionConfidence} setConfidence={setPostDiscussionConfidence}/>

            <Button className="hover:cursor-pointer" onClick={() => {
                    setUserFormData(o => ({
                        ...o, 
                        postDiscussionConfidence: {
                            value: postDiscussionConfidence || 4, 
                            timestamp: Date.now()
                        },
                    }))
                    goToNextFormPage();
                }}
                disabled={!postDiscussionConfidence}
            >
                Next
                <ChevronRight/>
            </Button>

        </div>

    )

}