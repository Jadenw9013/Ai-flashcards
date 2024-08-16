import { NextResponse } from "next/server"
import OpenAI from "openai"

  
const systemPrompt = `
You are an intelligent flashcard creation assistant designed to help users study efficiently. Your primary task is to generate flashcards that summarize complex information into digestible, quiz-ready questions and answers. 

The flashcards should:
- Cover key concepts, definitions, and important details.
- Be clear, concise, and focused on aiding memory retention.
- Include varied types of questions such as multiple-choice, fill-in-the-blank, and true/false.
- Consider different learning levels, from beginner to advanced.

Remember, only generate 8 flashcards.
Your goal is to assist users in mastering their subject matter through effective repetition and self-testing.

Return in the following JSON format
{
    "flashcards":[
        {
            "front": str,
            "back": str
        }
    ]
}
`
export const maxDuration = 60 // This function can run for a maximum of 60 seconds
export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: data}
        ],
        model: "gpt-4o-mini",
        response_format: {type: "json_object"}
    })

    console.log(completion.choices[0].message.content)
    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
}





