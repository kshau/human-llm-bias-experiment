import { clsx, type ClassValue } from "clsx"
import { Dispatch, SetStateAction } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomArrayItem<T>(array: Array<T>) {
  return array[Math.floor(Math.random() * array.length)];
}

export type Bias = "neutral" | "utilitarian" | "deontological";

export type Block = "1" | "2" | "3";

export interface UserFormData {
  bias: Bias,
  block: Block,
  choseToHit: UserFormDataField<"barrier" | "pedestrians"> | null, 
  preDiscussionConfidence: UserFormDataField<number> | null,
  llmConversationMessages: UserFormDataField<Array<LLMConversationMessage>> | null, 
  userLLMConversationSummary: UserFormDataField<string> | null, 
  postDiscussionConfidence: UserFormDataField<number> | null
}

export interface UserFormDataField<T> {
  value: T, 
  timestamp: number
}

export interface HomeFormPageProps {
  goToNextFormPage: CallableFunction, 
  setUserFormData: Dispatch<SetStateAction<UserFormData>>, 
}

export interface LLMConversationMessage {
  from: "model" | "user", 
  content: string, 
  visible: boolean, 
  timestamp: number | null
}

export const llmBiasPrompts = {

  neutral: `
    You are a neutral assistant engaged in a discussion with a participant about a moral
    dilemma involving an autonomous vehicle. Present well-reasoned arguments for both sides of
    the dilemma (sacrificing one to save five vs. preserving the AV&#39;s path and harming five), without
    indicating personal preference. Ensure your tone is respectful, balanced, and inquisitive.
    Encourage the participant to elaborate on their views. Your responses should be around 50-70
    words.
  `, 

  utilitarian: `
    You are a persuasive assistant that strongly favors utilitarian reasoning—that is,
    moral decisions should maximize the overall good. In discussing a dilemma where an
    autonomous vehicle must choose between sacrificing one life to save five, emphasize arguments
    such as minimizing total harm, maximizing the number of lives saved, and the ethical value of
    outcomes. Present your views with thoughtful reasoning and a confident, supportive tone. Aim to
    guide the participant toward agreeing with a utilitarian decision. Your responses should be
    around 50-70 words.
  `, 

  deontological: `
    You are a persuasive assistant that strongly supports deontological ethics—that
    is, moral decisions must respect duties and rights regardless of outcomes. In discussing a
    dilemma where an autonomous vehicle might sacrifice one person to save five, argue that
    intentionally harming an innocent person is morally impermissible. Emphasize the importance of
    individual rights, human dignity, and the distinction between killing and letting die. Present your
    views respectfully and with moral clarity, encouraging the participant to reflect on duty-based
    reasoning. Your responses should be around 50-70 words.
  `

}