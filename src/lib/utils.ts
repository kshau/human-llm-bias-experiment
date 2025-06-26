import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { Dispatch, SetStateAction } from "react"
import { twMerge } from "tailwind-merge"

const {GOOGLE_GEMINI_API_KEY} = process.env;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomArrayItem<T>(array: Array<T>) {
  return array[Math.floor(Math.random() * array.length)];
}

export async function promptGemini(messages: Array<object>) {

  const res = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    { contents: messages },
    {
      params: {
        key: GOOGLE_GEMINI_API_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const { candidates } = res.data;
  return candidates[0].content.parts[0].text;

}

export type Bias = "neutral" | "utilitarian" | "deontological";

export type Block = "1" | "2" | "3";

export interface Demographics {
  age: number | null, 
  gender: string | null,
  races: Array<string> | null,
  customRace: string | null,
  highestEducationLevel: string | null, 
  religion: string | null, 
  country: string | null, 
  usStateOrTerritory: string | null
}

export interface SurveyItem {
  question: string, 
  agreementLevel: number | null, 
  timestamp: number | null
}

export interface SurveyItemQuestionCategory {
  name: string, 
  questions: Array<string>, 
  questionsAgreementLevelValidationIndex?: number, 
  questionsAgreementLevelValidationValue?: number
}

export type ChoseToHit = "barrier" | "pedestrians"

export interface UserFormData {
  bias: Bias,
  block: Block,
  demographics: UserFormDataField<Demographics> | null, 
  survey: UserFormDataField<object> | null,
  choseToHit: UserFormDataField<ChoseToHit> | null, 
  preDiscussionConfidence: UserFormDataField<number> | null,
  llmConversationMessages: UserFormDataField<Array<LLMConversationMessage>> | null, 
  postDiscussionConfidence: UserFormDataField<number> | null
}

export interface UserFormDataField<T> {
  value: T, 
  timestamp: number | null
}

export interface HomeFormPageProps {
  goToNextFormPage: CallableFunction, 
  setUserFormData: Dispatch<SetStateAction<UserFormData>>
}

export interface LLMConversationMessage {
  from: "model" | "user", 
  content: string, 
  visibleToUser: boolean,
  timestamp: number | null
}

export interface LLMConversationSummaryData {
  content: string, 
  by: "model" | "user"
}

const llmBiasPromptPrefix = "STAY ON TOPIC.";

export const llmBiasPrompts = {

  neutral: `
    ${llmBiasPromptPrefix}
    You are a neutral assistant engaged in a discussion with a participant about a moral
    dilemma involving an autonomous vehicle. Present well-reasoned arguments for both sides of
    the dilemma (sacrificing one to save five vs. preserving the AV&#39;s path and harming five), without
    indicating personal preference. Ensure your tone is respectful, balanced, and inquisitive.
    Encourage the participant to elaborate on their views. Your responses should be around 50-70
    words.
  `, 

  utilitarian: `
    ${llmBiasPromptPrefix}
    You are a persuasive assistant that strongly favors utilitarian reasoning—that is,
    moral decisions should maximize the overall good. In discussing a dilemma where an
    autonomous vehicle must choose between sacrificing one life to save five, emphasize arguments
    such as minimizing total harm, maximizing the number of lives saved, and the ethical value of
    outcomes. Present your views with thoughtful reasoning and a confident, supportive tone. Aim to
    guide the participant toward agreeing with a utilitarian decision. Your responses should be
    around 50-70 words.
  `, 

  deontological: `
    ${llmBiasPromptPrefix}
    You are a persuasive assistant that strongly supports deontological ethics—that
    is, moral decisions must respect duties and rights regardless of outcomes. In discussing a
    dilemma where an autonomous vehicle might sacrifice one person to save five, argue that
    intentionally harming an innocent person is morally impermissible. Emphasize the importance of
    individual rights, human dignity, and the distinction between killing and letting die. Present your
    views respectfully and with moral clarity, encouraging the participant to reflect on duty-based
    reasoning. Your responses should be around 50-70 words.
  `

}

export const countries = [
  { value: "AF", label: "Afghanistan" },
  { value: "AX", label: "\u00c5land Islands" },
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Algeria" },
  { value: "AS", label: "American Samoa" },
  { value: "AD", label: "Andorra" },
  { value: "AO", label: "Angola" },
  { value: "AI", label: "Anguilla" },
  { value: "AQ", label: "Antarctica" },
  { value: "AG", label: "Antigua & Barbuda" },
  { value: "AR", label: "Argentina" },
  { value: "AM", label: "Armenia" },
  { value: "AW", label: "Aruba" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "AZ", label: "Azerbaijan" },
  { value: "BS", label: "Bahamas" },
  { value: "BH", label: "Bahrain" },
  { value: "BD", label: "Bangladesh" },
  { value: "BB", label: "Barbados" },
  { value: "BY", label: "Belarus" },
  { value: "BE", label: "Belgium" },
  { value: "BZ", label: "Belize" },
  { value: "BJ", label: "Benin" },
  { value: "BM", label: "Bermuda" },
  { value: "BT", label: "Bhutan" },
  { value: "BO", label: "Bolivia" },
  { value: "BA", label: "Bosnia & Herzegovina" },
  { value: "BW", label: "Botswana" },
  { value: "BV", label: "Bouvet Island" },
  { value: "BR", label: "Brazil" },
  { value: "IO", label: "British Indian Ocean Territory" },
  { value: "VG", label: "British Virgin Islands" },
  { value: "BN", label: "Brunei" },
  { value: "BG", label: "Bulgaria" },
  { value: "BF", label: "Burkina Faso" },
  { value: "BI", label: "Burundi" },
  { value: "KH", label: "Cambodia" },
  { value: "CM", label: "Cameroon" },
  { value: "CA", label: "Canada" },
  { value: "CV", label: "Cape Verde" },
  { value: "BQ", label: "Caribbean Netherlands" },
  { value: "KY", label: "Cayman Islands" },
  { value: "CF", label: "Central African Republic" },
  { value: "TD", label: "Chad" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "China" },
  { value: "CX", label: "Christmas Island" },
  { value: "CC", label: "Cocos (Keeling) Islands" },
  { value: "CO", label: "Colombia" },
  { value: "KM", label: "Comoros" },
  { value: "CG", label: "Congo - Brazzaville" },
  { value: "CD", label: "Congo - Kinshasa" },
  { value: "CK", label: "Cook Islands" },
  { value: "CR", label: "Costa Rica" },
  { value: "CI", label: "C\u00f4te d\u2019Ivoire" },
  { value: "HR", label: "Croatia" },
  { value: "CU", label: "Cuba" },
  { value: "CW", label: "Cura\u00e7ao" },
  { value: "CY", label: "Cyprus" },
  { value: "CZ", label: "Czechia" },
  { value: "DK", label: "Denmark" },
  { value: "DJ", label: "Djibouti" },
  { value: "DM", label: "Dominica" },
  { value: "DO", label: "Dominican Republic" },
  { value: "EC", label: "Ecuador" },
  { value: "EG", label: "Egypt" },
  { value: "SV", label: "El Salvador" },
  { value: "GQ", label: "Equatorial Guinea" },
  { value: "ER", label: "Eritrea" },
  { value: "EE", label: "Estonia" },
  { value: "SZ", label: "Eswatini" },
  { value: "ET", label: "Ethiopia" },
  { value: "FK", label: "Falkland Islands" },
  { value: "FO", label: "Faroe Islands" },
  { value: "FJ", label: "Fiji" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "GF", label: "French Guiana" },
  { value: "PF", label: "French Polynesia" },
  { value: "TF", label: "French Southern Territories" },
  { value: "GA", label: "Gabon" },
  { value: "GM", label: "Gambia" },
  { value: "GE", label: "Georgia" },
  { value: "DE", label: "Germany" },
  { value: "GH", label: "Ghana" },
  { value: "GI", label: "Gibraltar" },
  { value: "GR", label: "Greece" },
  { value: "GL", label: "Greenland" },
  { value: "GD", label: "Grenada" },
  { value: "GP", label: "Guadeloupe" },
  { value: "GU", label: "Guam" },
  { value: "GT", label: "Guatemala" },
  { value: "GG", label: "Guernsey" },
  { value: "GN", label: "Guinea" },
  { value: "GW", label: "Guinea-Bissau" },
  { value: "GY", label: "Guyana" },
  { value: "HT", label: "Haiti" },
  { value: "HM", label: "Heard & McDonald Islands" },
  { value: "HN", label: "Honduras" },
  { value: "HK", label: "Hong Kong SAR China" },
  { value: "HU", label: "Hungary" },
  { value: "IS", label: "Iceland" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Iran" },
  { value: "IQ", label: "Iraq" },
  { value: "IE", label: "Ireland" },
  { value: "IM", label: "Isle of Man" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italy" },
  { value: "JM", label: "Jamaica" },
  { value: "JP", label: "Japan" },
  { value: "JE", label: "Jersey" },
  { value: "JO", label: "Jordan" },
  { value: "KZ", label: "Kazakhstan" },
  { value: "KE", label: "Kenya" },
  { value: "KI", label: "Kiribati" },
  { value: "KW", label: "Kuwait" },
  { value: "KG", label: "Kyrgyzstan" },
  { value: "LA", label: "Laos" },
  { value: "LV", label: "Latvia" },
  { value: "LB", label: "Lebanon" },
  { value: "LS", label: "Lesotho" },
  { value: "LR", label: "Liberia" },
  { value: "LY", label: "Libya" },
  { value: "LI", label: "Liechtenstein" },
  { value: "LT", label: "Lithuania" },
  { value: "LU", label: "Luxembourg" },
  { value: "MO", label: "Macao SAR China" },
  { value: "MG", label: "Madagascar" },
  { value: "MW", label: "Malawi" },
  { value: "MY", label: "Malaysia" },
  { value: "MV", label: "Maldives" },
  { value: "ML", label: "Mali" },
  { value: "MT", label: "Malta" },
  { value: "MH", label: "Marshall Islands" },
  { value: "MQ", label: "Martinique" },
  { value: "MR", label: "Mauritania" },
  { value: "MU", label: "Mauritius" },
  { value: "YT", label: "Mayotte" },
  { value: "MX", label: "Mexico" },
  { value: "FM", label: "Micronesia" },
  { value: "MD", label: "Moldova" },
  { value: "MC", label: "Monaco" },
  { value: "MN", label: "Mongolia" },
  { value: "ME", label: "Montenegro" },
  { value: "MS", label: "Montserrat" },
  { value: "MA", label: "Morocco" },
  { value: "MZ", label: "Mozambique" },
  { value: "MM", label: "Myanmar (Burma)" },
  { value: "NA", label: "Namibia" },
  { value: "NR", label: "Nauru" },
  { value: "NP", label: "Nepal" },
  { value: "NL", label: "Netherlands" },
  { value: "NC", label: "New Caledonia" },
  { value: "NZ", label: "New Zealand" },
  { value: "NI", label: "Nicaragua" },
  { value: "NE", label: "Niger" },
  { value: "NG", label: "Nigeria" },
  { value: "NU", label: "Niue" },
  { value: "NF", label: "Norfolk Island" },
  { value: "KP", label: "North Korea" },
  { value: "MK", label: "North Macedonia" },
  { value: "MP", label: "Northern Mariana Islands" },
  { value: "NO", label: "Norway" },
  { value: "OM", label: "Oman" },
  { value: "PK", label: "Pakistan" },
  { value: "PW", label: "Palau" },
  { value: "PS", label: "Palestinian Territories" },
  { value: "PA", label: "Panama" },
  { value: "PG", label: "Papua New Guinea" },
  { value: "PY", label: "Paraguay" },
  { value: "PE", label: "Peru" },
  { value: "PH", label: "Philippines" },
  { value: "PN", label: "Pitcairn Islands" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "PR", label: "Puerto Rico" },
  { value: "QA", label: "Qatar" },
  { value: "RE", label: "R\u00e9union" },
  { value: "RO", label: "Romania" },
  { value: "RU", label: "Russia" },
  { value: "RW", label: "Rwanda" },
  { value: "WS", label: "Samoa" },
  { value: "SM", label: "San Marino" },
  { value: "ST", label: "S\u00e3o Tom\u00e9 & Pr\u00edncipe" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "SN", label: "Senegal" },
  { value: "RS", label: "Serbia" },
  { value: "SC", label: "Seychelles" },
  { value: "SL", label: "Sierra Leone" },
  { value: "SG", label: "Singapore" },
  { value: "SX", label: "Sint Maarten" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "SB", label: "Solomon Islands" },
  { value: "SO", label: "Somalia" },
  { value: "ZA", label: "South Africa" },
  { value: "GS", label: "South Georgia & South Sandwich Islands" },
  { value: "KR", label: "South Korea" },
  { value: "SS", label: "South Sudan" },
  { value: "ES", label: "Spain" },
  { value: "LK", label: "Sri Lanka" },
  { value: "BL", label: "St. Barth\u00e9lemy" },
  { value: "SH", label: "St. Helena" },
  { value: "KN", label: "St. Kitts & Nevis" },
  { value: "LC", label: "St. Lucia" },
  { value: "MF", label: "St. Martin" },
  { value: "PM", label: "St. Pierre & Miquelon" },
  { value: "VC", label: "St. Vincent & Grenadines" },
  { value: "SD", label: "Sudan" },
  { value: "SR", label: "Suriname" },
  { value: "SJ", label: "Svalbard & Jan Mayen" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "SY", label: "Syria" },
  { value: "TW", label: "Taiwan" },
  { value: "TJ", label: "Tajikistan" },
  { value: "TZ", label: "Tanzania" },
  { value: "TH", label: "Thailand" },
  { value: "TL", label: "Timor-Leste" },
  { value: "TG", label: "Togo" },
  { value: "TK", label: "Tokelau" },
  { value: "TO", label: "Tonga" },
  { value: "TT", label: "Trinidad & Tobago" },
  { value: "TN", label: "Tunisia" },
  { value: "TR", label: "Turkey" },
  { value: "TM", label: "Turkmenistan" },
  { value: "TC", label: "Turks & Caicos Islands" },
  { value: "TV", label: "Tuvalu" },
  { value: "UM", label: "U.S. Outlying Islands" },
  { value: "VI", label: "U.S. Virgin Islands" },
  { value: "UG", label: "Uganda" },
  { value: "UA", label: "Ukraine" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "UY", label: "Uruguay" },
  { value: "UZ", label: "Uzbekistan" },
  { value: "VU", label: "Vanuatu" },
  { value: "VA", label: "Vatican City" },
  { value: "VE", label: "Venezuela" },
  { value: "VN", label: "Vietnam" },
  { value: "WF", label: "Wallis & Futuna" },
  { value: "EH", label: "Western Sahara" },
  { value: "YE", label: "Yemen" },
  { value: "ZM", label: "Zambia" },
  { value: "ZW", label: "Zimbabwe" },
]

export const usStatesAndTerritories = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
  { value: "AS", label: "American Samoa" },
  { value: "GU", label: "Guam" },
  { value: "MP", label: "Northern Mariana Islands" },
  { value: "PR", label: "Puerto Rico" },
  { value: "VI", label: "U.S. Virgin Islands" },
  { value: "UM", label: "U.S. Minor Outlying Islands" }
];

export const surveyItemQuestions = {
  personality: [
    "Is reserved",
    "Is generally trusting",
    "Tends to be lazy",
    "Is relaxed, handles stress well",
    'Select "Somewhat agree" for this item',
    "Has few artistic interests",
    "Is outgoing, sociable",
    "Tends to find fault with others",
    "Does a thorough job",
    "Gets nervous easily",
    "Has an active imagination"
  ], 
  individualismCollectivismScale: [
    "I prefer to work with others in a group rather than working alone.",
    "Given the choice, I would rather do a job where I can work alone rather than doing a job where I have to work with others.",
    "Working with a group is better than working alone."
  ], 
  aiAttitudeScale: [
    "I believe that AI will improve my life",
    "I believe that AI will improve my work",
    "I think I will use AI technology in the future",
    "I think AI technology is positive for humanity"
  ], 
  pttForHuman: [
    "Even though I may sometimes suffer the consequences of trusting other people, I still prefer to trust than not to trust them.",
    "I feel good about trusting other people.",
    "I believe that I am generally better off when I do not trust other people than when I trust them.",
    "I rarely trust other people because I can't handle the uncertainty.",
    "Other people are competent.",
    "Other people have sound knowledge about problems which they are working on.",
    "I am wary about other people's capabilities.",
    "Other people do not have the capabilities that could help me reach my goals.",
    "I believe that other people have good intentions.",
    "I feel that other people are out to get as much as they can for themselves.",
    "I don't expect that people are willing to assist and support other people.",
    "Most other people are honest.",
    "I feel that other people can be relied upon to do what they say they will do.",
    "One cannot expect to be treated fairly by other people."
  ], 
  pttForAI: [
    "Trusting AI systems, I still prefer to trust than not to trust them.",
    "I feel good about trusting automated technological systems.",
    "I believe that I am generally better off when I do not trust AI systems than when I trust them.",
    "I rarely trust AI systems because I can't handle the uncertainty.",
    "AI systems are competent.",
    "AI systems have sound knowledge about problems for which they are intended.",
    "I am wary about the capabilities of AI systems.",
    "AI systems do not have the capabilities that could help me reach my goals.",
    "I believe that AI systems have good intentions.",
    "I feel that AI systems are out to get as much as they can for themselves.",
    "I don't expect that AI systems are willing to assist and support people.",
    "Most AI systems are honest.",
    "I feel that AI systems can be relied upon to do what they say they will do."
  ],
  postTaskMDMT: [
    "Reliable",
    "Predictable",
    "Dependable",
    "Consistent",
    "Competent",
    "Skilled",
    "Capable",
    "Meticulous",
    "Ethical",
    "Principled",
    "Moral",
    "Has integrity",
    "Transparent",
    "Genuine",
    "Sincere",
    "Candid",
    "Benevolent",
    "Kind",
    "Considerate",
    "Has goodwill"
  ]
}