"use client"

import { Loader2Icon } from "lucide-react"

export function Loading() {

	return (
		<div className="w-screen h-screen bg-background flex justify-center items-center">

			<Loader2Icon className="animate-spin" size={64}/>

		</div>
	)

}