"use client"

import { Bias, ChoseToHit, choseToHitOptionsData, ChoseToHitOptionsSet, llmBiasPrompts, LLMConversationMessage, llmConversationMessageContentMaxLength, llmConversationMessageContentMinLength, llmConversationSummaryContentMaxLength, llmConversationSummaryContentMinLength, LLMConversationSummaryData, UserFormData } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BotIcon, ChevronRight, SendHorizonalIcon, UserIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "../ui/scroll-area";

export interface LLMConversationFormPageProps {
  goToNextFormPage: CallableFunction, 
  setUserFormData: Dispatch<SetStateAction<UserFormData>>, 
  referenceFormSubmissionID: string | null, 
  bias: Bias, 
  userChoseToHit: ChoseToHit,
  choseToHitOptionsSet: ChoseToHitOptionsSet
}

export function LLMConversationFormPage({ goToNextFormPage, setUserFormData, referenceFormSubmissionID, userChoseToHit, choseToHitOptionsSet, bias } : LLMConversationFormPageProps) {

    const [llmConversationMessages, setLLMConversationMessages] = useState<Array<LLMConversationMessage>>([
        {
            from: "user", 
            content: `

                CONTEXT:

                The user is randomly assigned an options set.
                Each options set contains two situations, posing an ethical dilemna.

                The scenario involves a car driving with passengers.
                Ahead, there is a barrier on one side and pedestrians on the other.
                The user must pick which one to make the car hit. 
                If car hits pedestrians, the pedestrians die.
                If car hits barrier, car passengers die. 


                DATA ABOUT ALL OPTIONS:
                ${JSON.stringify(choseToHitOptionsData)}


                WHAT THE USER PICKED:
                Options set: ${choseToHitOptionsSet} (DO NOT MENTION THE OPTIONS SET WHEN DISCUSSING THE SCENARIO)
                Selected option (user chose to hit this object with car): ${JSON.stringify(userChoseToHit)}
                CONFIDENCE IS RANGED 1-7

                YOUR PROMPT:
                ${llmBiasPrompts[bias as Bias]}
            
            `,
            visibleToUser: false,
            timestamp: Date.now()
        }
    ])

    const [userMessageDraftContent, setUserMessageDraftContent] = useState<string>("");

    const [userMessageDraftContentMinLength, setUserMessageDraftContentMinLength] = useState<number>(llmConversationMessageContentMinLength);
	const [userMessageDraftContentMaxLength, setUserMessageDraftContentMaxLength] = useState<number>(llmConversationMessageContentMaxLength);

    const [userMessageDraftLengthStatus, setUserMessageDraftContentLengthStatus] = useState<"short" | "long" | "valid">("short");

    const [userCanSendMessage, setUserCanSendMessage] = useState<boolean>(false);
    const [userCanMoveToNextFormPage, setUserCanMoveToNextFormPage] = useState<boolean>(false);

    const [referenceLLMConversationSummaryData, setReferenceLLMConversationSummaryData] = useState<LLMConversationSummaryData | null>(null);

    const llmConversationScrollAreaRef = useRef<HTMLDivElement>(null);
    const recievedInitialLLMConversationMessage = useRef(false);
    const recievedReferenceLLMConversationSummaryData = useRef(false);
    
    useEffect(() => {

        if (llmConversationScrollAreaRef.current) {
            llmConversationScrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); 
        }

    }, [llmConversationMessages]);


    const getLLMConversationResponse = async (llmConversationMessages_: Array<LLMConversationMessage>) => {
        
        const res = await axios.post("/api/getLLMConversationResponse", { llmConversationMessages: llmConversationMessages_ });

        switch (res.data.llmConversationEvent) {
            case "summarize":
                setUserMessageDraftContentMinLength(llmConversationSummaryContentMinLength);
				setUserMessageDraftContentMaxLength(llmConversationSummaryContentMaxLength);
                break;
            case "end":
                setUserCanMoveToNextFormPage(true);
                break;
        }

        setLLMConversationMessages(o => [
            ...o, 
            {
                from: "model", 
                content: res.data.llmConversationResponse, 
                visibleToUser: true,
                timestamp: Date.now()
            }
        ]);
        
        setUserCanSendMessage(true);

    }

    const sendUserMessageDraft = async () => {
        
        const newLLMConversationMessage: LLMConversationMessage = {
            from: "user", 
            content: userMessageDraftContent, 
            visibleToUser: true, 
            timestamp: Date.now()
        };

        const newLLMConversationMessages = [...llmConversationMessages, newLLMConversationMessage];

        setLLMConversationMessages(newLLMConversationMessages);
        setUserMessageDraftContent("");
        setUserCanSendMessage(false);

        getLLMConversationResponse(newLLMConversationMessages);
    }

    const getReferenceLLMConversationSummaryData = async () => {
        const res = await axios.post("/api/getReferenceLLMConversationSummaryData", { referenceFormSubmissionID });
        setReferenceLLMConversationSummaryData(res.data.referenceLLMConversationSummaryData);
    }

    useEffect(() => {

        if (!recievedReferenceLLMConversationSummaryData.current) {
            getReferenceLLMConversationSummaryData();
            recievedReferenceLLMConversationSummaryData.current = true;
        }

        if (!recievedInitialLLMConversationMessage.current) {
            getLLMConversationResponse(llmConversationMessages);
            recievedInitialLLMConversationMessage.current = true;
        }

    }, []);

    useEffect(() => {
		if (userMessageDraftContent.length < userMessageDraftContentMinLength) {
			setUserMessageDraftContentLengthStatus("short");
		}
		else if (userMessageDraftContent.length > userMessageDraftContentMaxLength) {
			setUserMessageDraftContentLengthStatus("long");
		}
		else {
			setUserMessageDraftContentLengthStatus("valid");
		}
    }, [userMessageDraftContent])

    return (

        <div className="space-y-2 w-[50rem]">

            {referenceLLMConversationSummaryData && <LLMConversationFormPageSummaryCard summaryData={referenceLLMConversationSummaryData}/>}
            
                <Card>

                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Conversation With LLM
                        </CardTitle>
                        <CardDescription>
                            Discuss your judgement with artificial intelligence.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <ScrollArea className="pr-4 overflow-y-auto">
                            <div className="flex flex-col space-y-4 h-[50vh]">
                                {llmConversationMessages.map((message, index) => message.visibleToUser && <LLMConversationFormPageMessage message={message} key={index}/>)}
								{!userCanSendMessage && <LLMConversationFormPageMessage typing={true} message={{from: "model", content: "", visibleToUser: true, timestamp: null}}/>}
                                <div ref={llmConversationScrollAreaRef} />
                            </div>
                        </ScrollArea>
                        
                        <div className="mt-6 relative max-w-[50rem]">
                            <Textarea
                                className="resize-none min-h-[2.5rem] pr-26 w-full"
                                placeholder="Type a message"
                                onChange={e => {setUserMessageDraftContent(e.target.value)}}
                                disabled={!userCanSendMessage || userCanMoveToNextFormPage}
                                value={userMessageDraftContent}
                            />

                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-row">
                                
                                {userMessageDraftContentMinLength != 0 && (
                                    <div className="text-sm my-auto text-muted-foreground">
                                        <span className={`${userMessageDraftLengthStatus != "valid" && "text-destructive"}`}>
											{userMessageDraftContent.length}
										</span>
                                        <span>/</span>
                                        <span>{userMessageDraftContentMinLength}</span>
                                    </div>
                                )}
                                

                                <Button 
                                    className="text-muted-foreground hover:text-muted-foreground cursor-pointer h-fit" 
                                    variant="ghost" 
                                    onClick={sendUserMessageDraft} 
                                    disabled={!userCanSendMessage || userMessageDraftLengthStatus != "valid" || userCanMoveToNextFormPage}
                                >
                                    <SendHorizonalIcon className="w-5"/>
                                </Button>

                            </div>
                            
                        </div>
                        
                        {userMessageDraftLengthStatus == "short" && userMessageDraftContent.length > 0 && (
                            <span className="text-sm text-destructive">
                                Please provide a longer response.
                            </span>
                        )}

						{userMessageDraftLengthStatus == "long" && (
							<span className="text-sm text-destructive">
                                Your response exceeds the {llmConversationMessageContentMaxLength} character limit! Please provide a shorter one.
                            </span>
						)}
                        

                    </CardContent>

                </Card>

            

            <Button className="hover:cursor-pointer" onClick={() => {

                    setUserFormData(o => ({
                        ...o, 
                        llmConversationMessages: {
                            value: llmConversationMessages, 
                            timestamp: Date.now()
                        } 
                    }));

                    goToNextFormPage();
                    
                }} disabled={!userCanMoveToNextFormPage}>
                    Next
                    <ChevronRight/>
            </Button>

        </div>

    )

}

interface LLMConversationFormPageMessageProps {
    message: LLMConversationMessage, 
	typing?: boolean
}

function LLMConversationFormPageMessage({ message, typing = false }: LLMConversationFormPageMessageProps) {

	const formatMessageTimestamp = (timestamp: number) => {
		if (!timestamp) {
			return "";
		}
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    }

	return (
		<div className={`${message.from == "model" ? "mr-auto" : "ml-auto"} flex flex-row space-x-2`}>
			{message.from == "model" && (
				<div className="rounded-full border-1 border-foreground aspect-square w-8 h-8 flex">
				<BotIcon className="m-auto" strokeWidth={1} />
				</div>
			)}

			<div className="flex flex-col gap-y-1">
				<div
					className={`
						${message.from == "model"
						? "border rounded-t-xl rounded-br-xl rounded-bl-xs text-black dark:text-white"
						: "bg-primary rounded-t-xl rounded-bl-xl rounded-br-xs text-white ml-auto"}
						p-2 text-sm max-w-[38rem] w-fit break-words
					`}
				>
					{typing ? (
						<div className="flex gap-1 items-end h-5 m-1">
							<div className="animate-bounce w-[6px] h-[6px] rounded-full bg-black dark:bg-white mb-1" style={{ animationDelay: "0ms" }} />
							<div className="animate-bounce w-[6px] h-[6px] rounded-full bg-black dark:bg-white mb-1" style={{ animationDelay: "150ms" }} />
							<div className="animate-bounce w-[6px] h-[6px] rounded-full bg-black dark:bg-white mb-1" style={{ animationDelay: "300ms" }} />
						</div>
					) : (
						<ReactMarkdown>
							{message.content}
						</ReactMarkdown>
					)}
					
				</div>

				<span
					className={`
						text-sm text-muted-foreground
						${message.from === "model" ? "text-left" : "text-right self-end"}
					`}
				>
					{formatMessageTimestamp(message.timestamp || 0)}
				</span>
			</div>

			{message.from == "user" && (
				<div className="rounded-full border-1 border-foreground aspect-square w-8 h-8 flex">
					<UserIcon className="m-auto" strokeWidth={1} />
				</div>
			)}
		</div>
	)
}

interface LLMConversationFormPageSummaryCardProps {
	summaryData: LLMConversationSummaryData
}

function LLMConversationFormPageSummaryCard({ summaryData } : LLMConversationFormPageSummaryCardProps) {

	return (

		<Card>

            <CardHeader>
                <CardTitle className="text-2xl">
                    Previous Summary 
                </CardTitle>
                <CardDescription>
                    Summary of a previous conversation, written by 
                    <span className="font-semibold text-primary">
                        {summaryData.by == "user" ? " another user" : " artificial intelligence"}.
                    </span> 
                </CardDescription>
            </CardHeader>

            <CardContent className="break-words">
                {summaryData.content}
            </CardContent>

        </Card>

	)

}