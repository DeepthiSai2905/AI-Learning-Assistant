import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { jobDescription, resume, questionTypes } = await req.json();

    if (!jobDescription || !resume) {
      return NextResponse.json({ error: 'Job description and resume are required' }, { status: 400 });
    }

    if (!questionTypes || questionTypes.length === 0) {
      return NextResponse.json({ error: 'At least one question type must be selected' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Map question types to categories
    const typeToCategory = {
      technical: 'Technical Skills',
      behavioral: 'Behavioral',
      situational: 'Situational',
      motivation: 'Motivation'
    };

    const selectedCategories = questionTypes.map(type => typeToCategory[type]).join(', ');

    const prompt = `Based on the following job description and resume, generate 8-10 relevant interview questions. 
    Focus ONLY on the following question types: ${selectedCategories}
    
    The questions should be tailored to the specific role and the candidate's background.

    Job Description:
    ${jobDescription}

    Resume:
    ${resume}

    Generate questions in the following JSON format:
    [
      {
        "question": "What is your experience with [specific technology/skill mentioned in job description]?",
        "category": "Technical Skills"
      },
      {
        "question": "Tell me about a time when you [behavioral question related to job requirements]",
        "category": "Behavioral"
      },
      {
        "question": "How would you handle [situation relevant to the role]?",
        "category": "Situational"
      },
      {
        "question": "What interests you about this role at [company]?",
        "category": "Motivation"
      }
    ]

    Question type guidelines:
    - Technical Skills: Focus on programming languages, tools, frameworks, and technical knowledge relevant to the role
    - Behavioral: Use STAR format (Situation, Task, Action, Result) for past experiences
    - Situational: Present hypothetical scenarios and ask how they would handle them
    - Motivation: Focus on career goals, company interest, and cultural fit

    Make sure questions are specific to the job description and the candidate's background.
    Generate 2-3 questions for each selected category to ensure good coverage.`;

    const result = await model.generateContent(prompt);
    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    
    // Clean the response
    const cleaned = text
      .replace(/```json|```/g, "")
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse JSON:', cleaned);
      return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
    }

    return NextResponse.json({ questions });
  } catch (err) {
    console.error('Error generating interview questions:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 