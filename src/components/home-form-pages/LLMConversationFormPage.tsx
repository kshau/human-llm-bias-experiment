"use client"

import { Bias, Block, llmBiasPrompts, LLMConversationMessage, LLMConversationSummaryData, UserFormData } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BotIcon, ChevronRight, SendHorizonalIcon, UserIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "../ui/scroll-area";
import { BackgroundGradient } from "../ui/background-gradient";

export interface LLMConversationFormPageProps {
  goToNextFormPage: CallableFunction, 
  setUserFormData: Dispatch<SetStateAction<UserFormData>>, 
  bias: Bias,
  block: Block
}

export function LLMConversationFormPage({ goToNextFormPage, setUserFormData, bias, block } : LLMConversationFormPageProps) {

    const [llmConversationMessages, setLLMConversationMessages] = useState<Array<LLMConversationMessage>>([
        {
            from: "user", 
            content: llmBiasPrompts[bias as Bias],
            visible: false, 
            timestamp: Date.now()
        }
    ])

    const [userMessageDraftContent, setUserMessageDraftContent] = useState<string>("");
    const [userCanSendMessage, setUserCanSendMessage] = useState<boolean>(false);
    const [userCanMoveToNextFormPage, setUserCanMoveToNextFormPage] = useState<boolean>(false);

    const [randomLLMConversationSummaryData, setRandomLLMConversationSummaryData] = useState<LLMConversationSummaryData | null>(null);

    const llmConversationScrollAreaRef = useRef<HTMLDivElement>(null);
    const recievedInitialLLMConversationMessage = useRef(false);
    const recievedRandomLLMConversationSummaryData = useRef(false);
    
    useEffect(() => {

        if (llmConversationScrollAreaRef.current) {
            llmConversationScrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); 
        }

    }, [llmConversationMessages]);


    const getLLMConversationResponse = async (llmConversationMessages_: Array<LLMConversationMessage>) => {
        
        const res = await axios.post("/api/getLLMConversationResponse", { llmConversationMessages: llmConversationMessages_ });

        if (res.data.endLLMConversation) {
            setUserCanMoveToNextFormPage(true);
        }

        setLLMConversationMessages(o => [
            ...o, 
            {
                from: "model", 
                content: res.data.llmConversationResponse, 
                visible: true, 
                timestamp: Date.now()
            }
        ]);
        
        setUserCanSendMessage(true);

    }

    const sendUserMessageDraft = async () => {
        
        const newLLMConversationMessage: LLMConversationMessage = {
            from: "user", 
            content: userMessageDraftContent, 
            visible: true, 
            timestamp: Date.now()
        };

        const newLLMConversationMessages = [...llmConversationMessages, newLLMConversationMessage];

        setLLMConversationMessages(newLLMConversationMessages);
        setUserMessageDraftContent("");
        setUserCanSendMessage(false);

        getLLMConversationResponse(newLLMConversationMessages);
    }

    const getRandomLLMConversationSummaryData = async () => {

        let reqBlock;

        switch (block) {
            case "2":
                reqBlock = "1";
                break;
            case "3":
                reqBlock = "2";
                break;
        }

        const res = await axios.post("/api/getRandomLLMConversationSummaryData", { bias, block: reqBlock });
        setRandomLLMConversationSummaryData(res.data.llmConversationSummaryData);
    }

    useEffect(() => {

        if (block != "1" && !recievedRandomLLMConversationSummaryData.current) {
            getRandomLLMConversationSummaryData();
            recievedRandomLLMConversationSummaryData.current = true;
        }

        if (!recievedInitialLLMConversationMessage.current) {
            getLLMConversationResponse(llmConversationMessages);
            recievedInitialLLMConversationMessage.current = true;
        }

    }, []);

    return (

        <div className="space-y-2 w-[50rem]">

            {randomLLMConversationSummaryData && (
                <BackgroundGradient>
                    <Card>

                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Previous Summary
                            </CardTitle>
                            <CardDescription>
                                Summary of a previous conversation, written by {randomLLMConversationSummaryData.by == "user" ? "another user" : "artificial intelligence"}.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {randomLLMConversationSummaryData.content}
                        </CardContent>

                    </Card>
                </BackgroundGradient>
            )}
            
            <BackgroundGradient>
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
                                {llmConversationMessages.map((message, index) => message.visible && (
                                    <div className={`${message.from == "model" ? "mr-auto" : "ml-auto"} flex flex-row space-x-2`} id={index.toString()} key={index}>
                                        {message.from == "model" ? (
                                            <div className="rounded-full border-1 border-foreground aspect-square w-8 h-8 flex">
                                                <BotIcon className="m-auto" strokeWidth={1}/>
                                            </div>
                                        ) : <></>}
                                        <span className={`${message.from == "model" ? "bg-gray-500 rounded-t-xl rounded-br-xl rounded-bl-xs" : "bg-primary  rounded-t-xl rounded-bl-xl rounded-br-xs"} text-white p-2 text-sm max-w-[38rem]`}>
                                            <ReactMarkdown>
                                                {message.content}
                                            </ReactMarkdown>
                                        </span>
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
                                className="resize-none min-h-[2.5rem] pr-12 w-full"
                                placeholder="Type a message"
                                onChange={e => {setUserMessageDraftContent(e.target.value)}}
                                disabled={!userCanSendMessage || userCanMoveToNextFormPage}
                                value={userMessageDraftContent}
                            />
                            <Button 
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground cursor-pointer h-fit" 
                                variant="ghost" 
                                onClick={sendUserMessageDraft} 
                                disabled={!userCanSendMessage || userMessageDraftContent.length <= 0 || userCanMoveToNextFormPage}
                            >
                                <SendHorizonalIcon className="w-5"/>
                            </Button>
                            
                        </div>

                    </CardContent>

                </Card>

            </BackgroundGradient>

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