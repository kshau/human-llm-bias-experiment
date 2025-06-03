"use client"

import { bias, biasLLMPrompts, HomeFormPageProps, LLMConversationMessage, UserFormData } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BotIcon, SendHorizonalIcon, UserIcon, Users } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "../ui/scroll-area";

export interface LLMConversationFormPageProps {
  goToNextFormPage: CallableFunction, 
  setUserFormData: Dispatch<SetStateAction<UserFormData>>, 
  bias: bias
}

export function LLMConversationFormPage({ goToNextFormPage, setUserFormData, bias } : LLMConversationFormPageProps) {

    const [conversation, setConversation] = useState<Array<LLMConversationMessage>>([
        {
            from: "user", 
            content: biasLLMPrompts[bias as bias],
            visible: false, 
            timestamp: Date.now()
        }
    ])

    const [userMessageDraftContent, setUserMessageDraftContent] = useState<string>("");
    const [userCanSendMessage, setUserCanSendMessage] = useState<boolean>(false);
    const [userCanMoveToNextFormPage, setUserCanMoveToNextFormPage] = useState<boolean>(false);

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const recievedInitialLLMResponse = useRef(false);
    
    useEffect(() => {

        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); 
        }

        if (conversation.length > 11) {
            setUserCanMoveToNextFormPage(true);
        }

    }, [conversation]);


    const getLLMConversationWithResponse = async ( usingConversation: Array<LLMConversationMessage> ) => {
        
        const res = await axios.post("/api/getLLMConversationResponse", { conversation: usingConversation });

        setConversation(o => [
            ...o, 
            {
                from: "model", 
                content: res.data.responseFromLLM, 
                visible: true, 
                timestamp: Date.now()
            }
        ]);
        
        setUserCanSendMessage(true);

    }

    const sendUserMessageDraft = async () => {
        
        const newMessage: LLMConversationMessage = {
            from: "user", 
            content: userMessageDraftContent, 
            visible: true, 
            timestamp: Date.now()
        };

        const newConversation = [...conversation, newMessage];

        setConversation(newConversation);
        setUserMessageDraftContent("");
        setUserCanSendMessage(false);

        getLLMConversationWithResponse(newConversation);
    }

    useEffect(() => {
        if (!recievedInitialLLMResponse.current) {
            getLLMConversationWithResponse(conversation);
            recievedInitialLLMResponse.current = true;
        }
    }, []);

    return (

        <Card className="w-fit">

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
                    <div className="flex flex-col w-[50rem] space-y-4 h-[50vh]">
                        {conversation.map((message, index) => message.visible && (
                            <div className={`${message.from == "model" ? "mr-auto" : "ml-auto"} flex flex-row space-x-2`} id={index.toString()} key={index}>
                                {message.from == "model" ? (
                                    <div className="rounded-full border-black border-1 aspect-square w-8 h-8 flex">
                                        <BotIcon className="m-auto" strokeWidth={1}/>
                                    </div>
                                ) : <></>}
                                <span className={`${message.from == "model" ? "bg-primary rounded-t-xl rounded-br-xl rounded-bl-xs" : "bg-muted-foreground rounded-t-xl rounded-bl-xl rounded-br-xs"} text-white p-2 text-sm max-w-[38rem]`}>
                                    <ReactMarkdown>
                                        {message.content}
                                    </ReactMarkdown>
                                </span>
                                {message.from == "user" ? (
                                    <div className="rounded-full border-black border-1 aspect-square w-8 h-8 flex">
                                        <UserIcon className="m-auto" strokeWidth={1}/>
                                    </div>
                                ) : <></>}
                            </div>
                        ))}
                        <div ref={scrollAreaRef} />
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

            <CardFooter>
                <Button className="hover:cursor-pointer" onClick={() => {

                    setUserFormData(o => ({
                        ...o, 
                        conversationWithLLM: {
                            value: conversation, 
                            timestamp: Date.now()
                        } 
                    }));

                    goToNextFormPage();
                
                }} disabled={!userCanMoveToNextFormPage}>
                    Done
                </Button>
            </CardFooter>

        </Card>

    )

}