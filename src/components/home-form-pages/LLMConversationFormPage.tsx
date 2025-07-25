"use client"

import { Bias, ChoseToHit, choseToHitOptionData, ChoseToHitOptionsSet, llmBiasPrompts, LLMConversationMessage, LLMConversationSummaryData, UserFormData } from "@/lib/utils";
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
                ${JSON.stringify(choseToHitOptionData)}


                WHAT THE USER PICKED:
                Options set: ${choseToHitOptionsSet}
                Selected option (user chose to hit this object with car): ${JSON.stringify(userChoseToHit)}

                YOUR PROMPT:
                ${llmBiasPrompts[bias as Bias]}
            
            `,
            visibleToUser: false,
            timestamp: Date.now()
        }
    ])

    const [userMessageDraftContent, setUserMessageDraftContent] = useState<string>("");
    const [userMessageDraftContentRequiredLength, setUserMessageDraftContentRequiredLength] = useState<number>(100);
    const [userMessageDraftContentLongEnough, setUserMessageDraftContentLongEnough] = useState<boolean>(false);

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
                setUserMessageDraftContentRequiredLength(250);
                break;
            case "end":
                setUserMessageDraftContentRequiredLength(0);
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

    const formatLLMConversationMessageTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
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
        setUserMessageDraftContentLongEnough(userMessageDraftContent.length >= userMessageDraftContentRequiredLength);
    }, [userMessageDraftContent])

    return (

        <div className="space-y-2 w-[50rem]">

            {referenceLLMConversationSummaryData && (
                
                    <Card>

                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Previous Summary
                            </CardTitle>
                            <CardDescription>
                                Summary of a previous conversation, written by 
                                <span className="font-semibold text-primary">
                                    {referenceLLMConversationSummaryData.by == "user" ? " another user" : " artificial intelligence"}.
                                </span> 
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="break-words">
                            {referenceLLMConversationSummaryData.content}
                        </CardContent>

                    </Card>
                
            )}
            
            
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
                                {llmConversationMessages.map((message, index) => message.visibleToUser && (
                                    <div className={`${message.from == "model" ? "mr-auto" : "ml-auto"} flex flex-row space-x-2`} id={index.toString()} key={index}>

                                        {message.from == "model" ? (
                                            <div className="rounded-full border-1 border-foreground aspect-square w-8 h-8 flex">
                                                <BotIcon className="m-auto" strokeWidth={1}/>
                                            </div>
                                        ) : <></>}

                                        <div className="flex flex-col gap-y-1">

                                            <div
                                                className={`
                                                  ${message.from == "model"
                                                    ? "border rounded-t-xl rounded-br-xl rounded-bl-xs text-black dark:text-white"
                                                    : "bg-primary rounded-t-xl rounded-bl-xl rounded-br-xs text-white ml-auto"}
                                                  p-2 text-sm max-w-[38rem] w-fit break-words
                                                `}
                                            >
                                                <ReactMarkdown>
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>

                                            <span
                                              className={`
                                                text-sm text-muted-foreground
                                                ${message.from === "model" ? "text-left" : "text-right self-end"}
                                              `}
                                            >
                                              {formatLLMConversationMessageTimestamp(message.timestamp || 0)}
                                            </span>

                                        </div>

                                        {message.from == "user" ? (
                                            <div className="rounded-full border-1 border-foreground aspect-square w-8 h-8 flex">
                                                <UserIcon className="m-auto" strokeWidth={1}/>
                                            </div>
                                        ) : <></>}
                                    </div>
                                ))}
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
                                
                                {userMessageDraftContentRequiredLength != 0 && (
                                    <div className="text-sm my-auto text-muted-foreground">
                                        <span className={`${!userMessageDraftContentLongEnough && "text-destructive"}`}>{userMessageDraftContent.length}</span>
                                        <span>/</span>
                                        <span>{userMessageDraftContentRequiredLength}</span>
                                    </div>
                                )}
                                

                                <Button 
                                    className="text-muted-foreground hover:text-muted-foreground cursor-pointer h-fit" 
                                    variant="ghost" 
                                    onClick={sendUserMessageDraft} 
                                    disabled={!userCanSendMessage || !userMessageDraftContentLongEnough || userCanMoveToNextFormPage}
                                >
                                    <SendHorizonalIcon className="w-5"/>
                                </Button>

                            </div>
                            
                        </div>
                        
                        {!userMessageDraftContentLongEnough && userMessageDraftContent.length > 0 && (
                            <span className="text-sm text-destructive">
                                Please provide a longer response.
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