import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { topic, difficulty, numQues } = await req.json();
    console.log("topic",topic)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
   
    const difficultyPrompts = {
      easy: 'with simple, basic concepts',
      medium: 'with moderate complexity and some challenging concepts',
      hard: 'with advanced concepts and detailed analysis'
    };
    console.log("model",model)
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY env variable');
    }
    console.log("no error in gemini api key")
    const prompt = `Generate ${numQues} multiple choice questions on "${topic}" ${difficultyPrompts[difficulty]} as a JSON array like [{"question": "...", "options": [...], "answer": "..."}]`;
    //const prompt = `Generate 3 multiple choice questions on "${topic}" as a JSON array like [{"question": "...", "options": [...], "answer": "..."}]`;
    console.log("prompttt",prompt)
    const result = await model.generateContent(prompt);

    console.log("resulttt",result)
    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = text
      .replace(/```json|```/g, "") // remove ```json or ```
      .trim();

    let quiz;
    try {
      quiz = JSON.parse(cleaned);
    } catch (e) {
      return NextResponse.json({ error: `Could not parse JSON + ${e}`, raw: fullText }, { status: 500 });
    }

    return NextResponse.json({ quiz });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}