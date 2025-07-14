import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { question, jobDescription, resume } = await req.json();

    if (!question || !jobDescription || !resume) {
      return NextResponse.json({ error: 'Question, job description, and resume are required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Provide a detailed, structured answer for the following interview question, tailored to the job description and resume. Limit your response to 600 words. Use the following format with clear section headers (use Markdown bold for headers):\n\n1. **What the Interviewer is Looking For:**\n2. **How to Structure Your Answer (STAR Method):**\n3. **Key Points to Include (STAR Method):**\n4. **Example Approach (Hypothetical Scenario - STAR Method):**\n5. **Red Flags to Avoid:**\n6. **Follow-up Considerations:**\n\nThe last section (Follow-up Considerations) should be clearly separated.\n\nInterview Question: ${question}\n\nJob Description:\n${jobDescription}\n\nResume:\n${resume}\n\nFormat your response in Markdown, use bullet points where helpful, and keep each section concise but informative. Do not exceed 600 words in total.`;

    const result = await model.generateContent(prompt);
    const explanation = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!explanation) {
      return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
    }

    return NextResponse.json({ explanation });
  } catch (err) {
    console.error('Error generating explanation:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 